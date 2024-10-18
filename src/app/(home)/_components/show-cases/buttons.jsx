"use client";
/** @import { ButtonVariant } from '~/components/ui/button/types.ts' */

import { useState } from "react";
import { Button } from "~/components/ui/button";
import ShowcaseArticle from "../article";
import { useShowDialog } from "~/stores/dialogs-manager";
import { DialogDescription, DialogTitle } from "~/components/ui/dialog";

const buttonThemes = /** @type {const} */ ([
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
  "success",
  "warning",
  "info",
  "dark",
  "light",
]);

const buttonSizes = /** @type {const} */ ([
  "default",
  "sm",
  "lg",
  "icon",
  "xl",
  "xs",
  null,
]);

export default function ButtonsShowSase() {
  const showDialog = useShowDialog();
  const [size, setSize] = useState(
    /** @type {ButtonVariant['size'] | null} */ ("default"),
  );

  return (
    <ShowcaseArticle
      header={{
        title: "Buttons",
        description: "Buttons are used to perform actions.",
      }}
      sections={[
        {
          title: "Themes and Sizes",
          description: "Buttons come in different themes and sizes.",
          content: (
            <>
              <label className="flex flex-wrap items-center gap-1">
                <span>Select size:</span>
                <select
                  className="w-32 rounded-md border border-solid border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  value={size ?? ""}
                  onChange={(e) => setSize(/** @type {any} */ (e.target.value))}
                >
                  {buttonSizes.map((size) => (
                    <option key={size ?? "none"} value={size ?? "none"}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap gap-4">
                {buttonThemes.map((theme) => (
                  <Button
                    key={theme}
                    variant={theme}
                    size={size}
                    onClick={async () => {
                      /** @typedef {{ answer: "Yes" } | { answer: "No" } | { answer: "Ha???"; userId: number; id: number; title: string, completed: boolean } | undefined} Answer */

                      /** @type {Answer} */
                      const answer = await showDialog(
                        (dialogResolve, managedDialogId) => (
                          <>
                            <DialogTitle>Dialog Title</DialogTitle>
                            <DialogDescription>
                              Dialog description
                            </DialogDescription>
                            <div className="flex flex-col">
                              <h2 className="title">Button Clicked</h2>
                              <p className="description">
                                You clicked the {theme} button.
                              </p>
                              <p>Do you want to continue?</p>
                              {/* button collections wrapper */}
                              <div className="mt-1 flex gap-2">
                                <Button
                                  onClick={() => {
                                    dialogResolve({ answer: "Yes" });
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  onClick={async () => {
                                    dialogResolve({ answer: "No" });
                                  }}
                                >
                                  No
                                </Button>
                                <Button
                                  onClick={async () => {
                                    try {
                                      const apiCall = await fetch(
                                        "https://jsonplaceholder.typicode.com/todos/1",
                                      ).then(
                                        (response) =>
                                          /** @type {Promise<{ userId: number; id: number; title: string, completed: boolean }>} */ (
                                            response.json()
                                          ),
                                      );
                                      dialogResolve({
                                        answer: "Ha???",
                                        ...apiCall,
                                      });
                                    } catch (e) {
                                      console.log(e);
                                      dialogResolve({ answer: "No" });
                                    }
                                  }}
                                >
                                  test
                                </Button>
                              </div>
                            </div>
                          </>
                        ),
                        {
                          // /** @type {Answer} */
                          // defaultResult: {
                          //   answer: "No",
                          // },
                          // stopCloseOn: ["escape_key", "click_outside"],
                        },
                      );

                      alert(
                        `You clicked: {${answer?.answer}}, on the dialog for the: {${theme}}, and button with size: {${size}}.`,
                      );
                    }}
                  >
                    {theme}
                  </Button>
                ))}
              </div>
            </>
          ),
        },
      ]}
    />
  );
}
