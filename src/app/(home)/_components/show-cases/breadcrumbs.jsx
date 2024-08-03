// "use client";

// import { Input } from "~/components/ui/input";
// import ShowcaseArticle from "../article";

// export default function InputsShowCase() {
//   return (
//     <ShowcaseArticle
//       header={{
//         title: "Inputs",
//         description: "Inputs are used to collect data from users.",
//       }}
//       sections={[
//         {
//           title: "Input",
//           description: "Input is a basic text input field.",
//           content: <Input />,
//         },
//       ]}
//     />
//   );
// }

"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import ShowcaseArticle from "../article";
import Link from "next/link";
import { BreadcrumbBuilder } from "~/components/ui/breadcrumb/builder";

// BreadcrumbBuilder

export default function BreadcrumbsShowCase() {
  return (
    <ShowcaseArticle
      header={{
        title: "Breadcrumbs",
        description:
          "Breadcrumbs are used to show the current page's location.",
      }}
      sections={[
        {
          title: "Breadcrumbs",
          description:
            "Breadcrumbs are used to show the current page's location.",
          content: (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/components">Components</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Buttons</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          ),
        },
        {
          title: "BreadcrumbBuilder",
          description:
            "BreadcrumbBuilder is a utility to generate breadcrumbs.",
          content: (
            <BreadcrumbBuilder
              pathname="/first/components/ui/breadcrumb"
              disableLastBreadcrumb
              excludeMap={{ first: true }}
              disableRoot
              // excludeRoot
              nameMap={{ ui: "UI" }}
              formatRoot={(name) => `🏠 ${name}`}
            />
          ),
        },
      ]}
    />
  );
}
