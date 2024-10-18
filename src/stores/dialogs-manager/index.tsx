// https://github.com/remult/remult/blob/main/examples/shadcn-react-table/src/components/dialog/dialog-context.tsx
// https://chatgpt.com/c/66e986ea-daa4-8013-a3a6-620e8639803e
// https://claude.ai/chat/263168dd-b3c7-4041-b19f-ea7b73c1715a
//
// Area of improvement
// - Store the active dialogs ids in a Set on the store itself for global tracking while keeping the local tracking for cleanup
// - Consider using a more robust ID generation system instead of a simple incrementing number to avoid potential conflicts.
// - Handling Dialog Nesting/Stacking, by keeping track of the active dialog IDs in a stack. ensure that the topmost dialog is the one that is focused and rendered, and the rest could be hidden or disabled, and when the topmost dialog is closed, the next dialog in the stack should be focused and rendered, and so on, until the stack is empty.
// - Add a mechanism to update dialog content without closing and reopening the dialog.
// - Add some form of logging or telemetry to track dialog usage and any errors that occur.

"use client";

import { createStore } from "zustand/vanilla";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { useStore } from "zustand";

type DialogId = number;

export type DialogContentRender<T> = (
  resolve: (result: T) => void,
  managedDialogId: DialogId,
) => ReactNode;

// Define Zustand store for managing dialogs
interface DialogsManagerStore {
  dialogs: {
    id: DialogId;
    onClose: () => void;
    render: () => ReactNode;
    stopCloseOn?: ("escape_key" | "click_outside")[];
    hide?: ("default_close_button" | "overlay")[];
  }[];
  addDialog: (dialog: DialogsManagerStore["dialogs"][0]) => void;
  removeDialog: (id: DialogId) => void;
  showDialog: <T>(
    render: DialogContentRender<T>,
    options?: {
      defaultResult?: T;
      stopCloseOn?: ("escape_key" | "click_outside")[];
      hide?: ("default_close_button" | "overlay")[];
      manageCleanup?: {
        setDialogId: (id: DialogId) => void;
        removeDialogId: (id: DialogId) => void;
      };
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
    dialogs: [],
    addDialog: (dialog) =>
      set((state) => ({ dialogs: [...state.dialogs, dialog] })),
    removeDialog: (id) =>
      set((state) => ({
        dialogs: state.dialogs.filter((dialog) => dialog.id !== id),
      })),

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
          const id = lastId++;

          addDialog({
            id,
            stopCloseOn: options.stopCloseOn,
            hide: options.hide,
            onClose: () => {
              removeDialog(id);
              resolve(options.defaultResult);
            },
            render: () =>
              render((result?: T) => {
                removeDialog(id);
                resolve(result);
              }, id),
          });
        });

        if (options.manageCleanup) {
          options.manageCleanup.removeDialogId(lastId);
        }

        return result;
      } catch (err) {
        console.error("Error displaying dialog", err);
        options.manageCleanup?.removeDialogId(lastId);
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
    onClose: VoidFunction;
    stopCloseOn?: ("escape_key" | "click_outside")[];
    hide?: ("default_close_button" | "overlay")[];
  }>,
) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          props.onClose();
        }
        setOpen(open);
      }}
    >
      <DialogContent
        hide={props.hide}
        onInteractOutside={(event) => {
          if (props.stopCloseOn?.includes("click_outside")) {
            event.preventDefault();
          }
        }}
        onEscapeKeyDown={(event) => {
          if (props.stopCloseOn?.includes("escape_key")) {
            event.preventDefault();
          }
        }}
      >
        {props.children}
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
  const dialogs = useStore(dialogsManagerStore, (state) => state.dialogs);
  console.log("___ dialogs", dialogs);

  return dialogs.map((item) => {
    const Item = item.render;
    return (
      <MyDialog
        key={item.id}
        onClose={item.onClose}
        stopCloseOn={item.stopCloseOn}
      >
        <Item />
      </MyDialog>
    );
  });
}

/**
 * Custom hook to manage dialog cleanup.
 *
 * Tracks active dialogs and ensures they are cleaned up when the component is unmounted.
 *
 * @returns An object with `setDialogId` and `removeDialogId` methods to manage dialog IDs.
 *
 * @example
 * ```tsx
 * const manageCleanup = useManagedDialogCleanup();
 * manageCleanup.setDialogId(1); // Track a dialog ID
 * manageCleanup.removeDialogId(1); // Remove dialog ID from tracking
 * ```
 */
function useManagedDialogsCleanup() {
  const dialogsIdsRef = useRef<Set<DialogId>>(new Set());

  const setDialogId = useCallback((id: DialogId) => {
    dialogsIdsRef.current.add(id);
  }, []);
  const removeDialogId = useCallback((id: DialogId) => {
    dialogsIdsRef.current.delete(id);
  }, []);

  useEffect(() => {
    const dialogsIdsRefCurrent = dialogsIdsRef.current;

    return () => {
      for (const id of dialogsIdsRefCurrent) {
        dialogsManagerStore.getState().removeDialog(id);
        dialogsIdsRefCurrent.delete(id);
      }
    };
  }, []);

  return useMemo(
    () => ({ setDialogId, removeDialogId }),
    [setDialogId, removeDialogId],
  );
}

/**
 * Hook to show a dialog.
 *
 * Returns a function that, when called, displays a dialog and manages its lifecycle.
 *
 * @returns A function that shows a dialog with a given render function and options.
 *
 * @example
 * ```tsx
 * const showDialog = useShowDialog();
 * const result = await showDialog((resolve) => (
 *   <div>
 *     <p>Do you confirm?</p>
 *     <button onClick={() => resolve(true)}>Confirm</button>
 *   </div>
 * ), { defaultResult: false });
 * console.log(result); // true or false
 * ```
 */
export function useShowDialog() {
  const showDialog = useStore(dialogsManagerStore, (state) => state.showDialog);
  const manageCleanup = useManagedDialogsCleanup();

  return useCallback(
    <T,>(
      render: DialogContentRender<T>,
      options: {
        defaultResult?: T;
        stopCloseOn?: ("escape_key" | "click_outside")[];
        hide?: ("default_close_button" | "overlay")[];
      } = {},
    ) => showDialog(render, { ...options, manageCleanup }),
    [showDialog, manageCleanup],
  );
}
