"use client";

import { Switch } from "~/components/ui/switch";
import ShowcaseArticle from "../article";

export default function SwitchesShowCase() {
  return (
    <ShowcaseArticle
      header={{
        title: "Switches",
        description: "Switches are used to collect data from users.",
      }}
      sections={[
        {
          title: "Switch",
          description: "Switch is a simple component to collect boolean data.",
          content: <Switch />,
        },
      ]}
    />
  );
}
