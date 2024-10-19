// https://github.com/remult/remult/blob/main/examples/shadcn-react-table/src/components/dialog/dialog-context.tsx
// https://claude.ai/chat/05bd29bb-f0ff-48e1-8316-ddb7c9ad681a
//
// Area of improvement
// - Store the active dialogs ids in a Set on the store itself for global tracking while keeping the local tracking for cleanup
// - Consider using a more robust ID generation system instead of a simple incrementing number to avoid potential conflicts.
// - Handling Dialog Nesting/Stacking, by keeping track of the active dialog IDs in a stack. ensure that the topmost dialog is the one that is focused and rendered, and the rest could be hidden or disabled, and when the topmost dialog is closed, the next dialog in the stack should be focused and rendered, and so on, until the stack is empty.
// - Add a mechanism to update dialog content without closing and reopening the dialog.
// - Add some form of logging or telemetry to track dialog usage and any errors that occur.
// - Consider adding a timeout for the closing animation. If for some reason the onTransitionEnd or onAnimationEnd events don't fire, you'll want to ensure the dialog still gets removed.
// - You might want to add a prop to MyDialog that allows for custom transition durations, making the component more flexible.
// - Consider implementing a focus management system to improve accessibility, especially when dealing with multiple open dialogs.
// - You could add a method to update existing dialogs without fully closing and reopening them, which could be useful for dynamic content.

"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

import { Dialog, DialogContent } from "~/components/ui/dialog";

type DialogId = string;
type ValueOrUpdater<T> = T | ((value: T) => T);

export type DialogContentRender<T> = (
  resolve: (result: T) => void,
  managedDialogId: DialogId,
) => ReactNode;

interface ManagedDialog {
  id: DialogId;
  dialogCompSelfClose?: () => void;
  onClose: () => void;
  render: () => ReactNode;
  stopCloseOn?: ("escape_key" | "click_outside")[];
  hide?: ("default_close_button" | "overlay")[];
  removeOnNavigation: boolean;
  createdAt: number;
  lastUpdatedat: number;
}

interface DialogsManagerStore {
  dialogsIds: DialogId[];
  dialogs: ManagedDialog[];
  addDialog: (dialog: ManagedDialog) => void;
  removeDialog: (id: DialogId) => void;
  updateDialogById: (
    dialogId: DialogId,
    valueOrUpdater: ValueOrUpdater<ManagedDialog>,
  ) => void;
  showDialog: <T>(
    render: DialogContentRender<T>,
    options?: {
      defaultResult?: T;
      stopCloseOn?: ("escape_key" | "click_outside")[];
      hide?: ("default_close_button" | "overlay")[];
      removeOnNavigation?: boolean;
      onDialogOpen?: (dialog: ManagedDialog) => void;
      onDialogClose?: (dialog: ManagedDialog) => void;
      onDialogError?: (err: unknown) => void;
    },
  ) => Promise<T | undefined>;
}

let lastId = 0;

/**
 * Zustand store for managing dialogs.
 * Provides methods to add, remove, and show dialogs.
 */
export const dialogsManagerStore = createStore<DialogsManagerStore>(
  (set, get) => ({
    dialogsIds: [],
    dialogs: [],
    addDialog: (dialog) =>
      set((state) => ({
        dialogs: [...state.dialogs, dialog],
        dialogsIds: [...state.dialogsIds, dialog.id],
      })),
    removeDialog: (id) =>
      set((state) => ({
        dialogs: state.dialogs.filter((dialog) => dialog.id !== id),
        dialogsIds: state.dialogsIds.filter((dialogId) => dialogId !== id),
      })),
    updateDialogById: (dialogId, valueOrUpdater) => {
      set((state) => ({
        dialogs: state.dialogs.map((dialog) => {
          if (dialog.id === dialogId) {
            let updatedDialog: ManagedDialog;
            if (typeof valueOrUpdater === "function") {
              updatedDialog = valueOrUpdater(dialog);
            } else {
              updatedDialog = {
                ...dialog,
                ...valueOrUpdater,
              };

              updatedDialog.lastUpdatedat = Date.now();

              return updatedDialog;
            }
          }

          return dialog;
        }),
      }));
    },

    /**
     * Show a new dialog.
     *
     * @template T - The type of result the dialog will return.
     * @param render - A function that renders the dialog content and calls `resolve` to return a result.
     * @param options - Additional options such as default result, error handling, and cleanup management.
     * @returns A promise that resolves to the dialog result or `undefined`.
     *
     * @example
     * ```tsx
     * const result = await showDialog((resolve) => (
     *   <div>
     *     <p>Do you confirm?</p>
     *     <button onClick={() => resolve(true)}>Confirm</button>
     *   </div>
     * ), { defaultResult: false });
     * console.log(result); // true or false
     * ```
     */
    async showDialog(render, options = {}) {
      type T = typeof render extends DialogContentRender<infer T> ? T : unknown;

      try {
        const result = await new Promise<T | undefined>((resolve) => {
          const { addDialog, removeDialog } = get();
          const dialogId = `dialog-${lastId++}-${Date.now()}`;

          const dialog: ManagedDialog = {
            id: dialogId,
            stopCloseOn: options.stopCloseOn,
            hide: options.hide,
            removeOnNavigation: options.removeOnNavigation ?? true,
            createdAt: Date.now(),
            lastUpdatedat: Date.now(),
            onClose: () => {
              options.onDialogClose?.(dialog);
              removeDialog(dialogId);
              resolve(options.defaultResult);
            },
            render: () => {
              options.onDialogOpen?.(dialog);
              return render((result?: T) => {
                const dialogCompSelfClose = get().dialogs.find(
                  (dialog) => dialog.id === dialogId,
                )?.dialogCompSelfClose;

                if (dialogCompSelfClose) {
                  return dialogCompSelfClose();
                }

                options.onDialogClose?.(dialog);
                removeDialog(dialogId);
                resolve(result);
              }, dialogId);
            },
          };

          addDialog(dialog);
        });

        return result;
      } catch (err) {
        console.error("Error displaying dialog", err);
        options.onDialogError?.(err);
        return undefined;
      }
    },
  }),
);

/**
 * Wrapper component for a dialog, providing basic open/close functionality.
 *
 * @param props - Props containing the dialog content and an `onClose` callback.
 *
 * @example
 * ```tsx
 * <MyDialog onClose={() => console.log('Dialog closed')}>
 *   <p>Dialog content goes here</p>
 * </MyDialog>
 * ```
 */
function MyDialog(
  props: PropsWithChildren<{
    dialogId: DialogId;
  }>,
) {
  const dialog = useStore(dialogsManagerStore, (state) =>
    state.dialogs.find((dialog) => dialog.id === props.dialogId),
  );
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navRef = useRef({ pathname, searchParams });
  const dialogRender = dialog?.render;
  const Item = useMemo(() => dialogRender?.(), [dialogRender]);

  useEffect(() => {
    if (!dialog?.id) {
      return;
    }

    dialogsManagerStore.getState().updateDialogById(dialog.id, (value) => ({
      ...value,
      dialogCompSelfClose: () => {
        setIsOpen(false);
      },
    }));
  }, []);

  useEffect(() => {
    if (!dialog?.removeOnNavigation) {
      return;
    }

    if (navRef.current.pathname === pathname) {
      return;
    }

    setIsOpen(false);
  }, [pathname, searchParams, dialog?.removeOnNavigation]);

  if (!dialog) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogContent
        onTransitionEnd={() => {
          if (isOpen) {
            return;
          }
          dialog.onClose();
        }}
        onAnimationEnd={() => {
          if (isOpen) {
            return;
          }
          dialog.onClose();
        }}
        hide={dialog.hide}
        onInteractOutside={(event) => {
          if (dialog.stopCloseOn?.includes("click_outside")) {
            event.preventDefault();
          }
        }}
        onEscapeKeyDown={(event) => {
          if (dialog.stopCloseOn?.includes("escape_key")) {
            event.preventDefault();
          }
        }}
      >
        {Item}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Renders all active dialogs managed by the `dialogsManagerStore`.
 *
 * Place this component at the root of your application to ensure dialogs are rendered with proper z-index.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <>
 *       <DialogsManagerItemsRenderer />
 *       // Other components go here
 *     </>
 *   );
 * }
 * ```
 */
export function DialogsManagerItemsRenderer() {
  const dialogsIds = useStore(dialogsManagerStore, (state) => state.dialogsIds);

  return dialogsIds.map((dialogId) => (
    <MyDialog key={dialogId} dialogId={dialogId} />
  ));
}

export const showDialog = dialogsManagerStore.getState().showDialog;
