"use client";

import { Input } from "~/components/ui/input";
import ShowcaseArticle from "../article";

export default function InputsShowCase() {
  return (
    <ShowcaseArticle
      header={{
        title: "Inputs",
        description: "Inputs are used to collect data from users.",
      }}
      sections={[
        {
          title: "Input",
          description: "Input is a basic text input field.",
          content: <Input />,
        },
      ]}
    />
  );
}
