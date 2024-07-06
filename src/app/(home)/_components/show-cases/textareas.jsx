"use client";

import { Textarea } from "~/components/ui/textarea";
import ShowcaseArticle from "../article";

export default function TextareasShowCase() {
  return (
    <ShowcaseArticle
      header={{
        title: "Textareas",
        description: "Textareas are used to input multiple lines of text.",
      }}
      sections={[
        {
          title: "Textarea",
          description: "Textarea is a basic text input field.",
          content: (
            <Textarea className="w-full" placeholder="Type something..." />
          ),
        },
      ]}
    />
  );
}
