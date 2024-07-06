import ShowcaseArticle from "../article";

import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Small,
  Blockquote,
  Ul,
  Ol,
  Li,
  Strong,
  Em,
} from "~/components/ui/typography";

export default function TypographyShowcase() {
  return (
    <ShowcaseArticle
      header={{
        title: "Typography",
        description:
          "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.",
      }}
      sections={[
        {
          title: "Headings",
          description: "Headings are used to introduce sections of content.",
          content: (
            <div className="space-y-4">
              <H1>This is Heading 1</H1>
              <H2>This is Heading 2</H2>
              <H3>This is Heading 3</H3>
              <H4>This is Heading 4</H4>
              <H5>This is Heading 5</H5>
              <H6>This is Heading 6</H6>
            </div>
          ),
        },
        {
          title: "Paragraphs",
          description:
            "Paragraphs are used to group sentences that relate to a single topic or idea.",
          content: (
            <P>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </P>
          ),
        },
        {
          title: "Text Styles",
          description: "Text styles are used to emphasize or highlight text.",
          content: (
            <div className="space-y-4">
              <Strong>Bold text</Strong>
              <Em>Italic text</Em>
              <P className="underline">Underlined text</P>
              <P className="line-through">Line-through text</P>
              <Small>This is small text</Small>
            </div>
          ),
        },
        {
          title: "Blockquotes",
          description:
            "Blockquotes are used to visually distinguish quoted or cited content.",
          content: (
            <Blockquote>
              This is a blockquote. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit.
            </Blockquote>
          ),
        },
        {
          title: "Lists",
          description: "Lists are used to group related items together.",
          content: (
            <div className="space-y-4">
              <H3>Unordered List</H3>
              <Ul>
                <Li>Item 1</Li>
                <Li>Item 2</Li>
                <Li>Item 3</Li>
              </Ul>
              <H3>Ordered List</H3>
              <Ol>
                <Li>Item 1</Li>
                <Li>Item 2</Li>
                <Li>Item 3</Li>
              </Ol>
            </div>
          ),
        },
      ]}
    />
  );
}
