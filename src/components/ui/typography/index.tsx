import { VariantProps, cva } from 'class-variance-authority';
import type { HTMLAttributes, ReactHTML, ReactNode } from 'react';

const textVariants = cva('', {
  variants: {
    variant: {
      muted: 'text-muted-foreground',
      'primary-gradient': [
        'bg-gradient-to-r from-primary-500 to-primary-400 text-transparent bg-clip-text',
        'group-hover:from-primary-500 group-hover:to-primary-400 group-hover:bg-gradient-to-r group-hover:text-transparent',
      ],
    },
    type: {
      h1: 'lg:text-5xl text-4xl font-semibold tracking-tight',
      h2: 'lg:text-4xl text-3xl font-semibold tracking-tight',
      h3: 'lg:text-3xl text-2xl font-semibold tracking-tight',
      h4: 'lg:text-2xl text-xl font-semibold tracking-tight',
      h5: 'lg:text-xl text-lg font-semibold tracking-tight',
      h6: 'lg:text-lg text-base font-semibold tracking-tight',
      p: 'text-base leading-7',
      small: 'text-sm font-medium leading-none',
      blockquote: 'border-s-2 ps-6 italic',
      ul: 'ms-6 list-disc flex flex-col gap-y-2',
      ol: 'ms-6 list-decimal flex flex-col gap-y-2',
      li: 'leading-7',
      strong: 'font-semibold',
      em: 'italic',
      'inline-code':
        'relative text-sm font-semibold rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono',
    },
  },
});

type TextVariant = VariantProps<typeof textVariants>;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  variant?: Extract<TextVariant['variant'], 'muted'>;
}
interface PProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: Extract<TextVariant['variant'], 'muted'>;
}
interface SmallProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: Extract<TextVariant['variant'], 'muted'>;
}
interface BlockquoteProps extends HTMLAttributes<HTMLQuoteElement> {
  variant?: Extract<TextVariant['variant'], 'muted'>;
}
interface UlProps extends HTMLAttributes<HTMLUListElement> {
  variant?: Extract<TextVariant['variant'], 'muted'>;
}
interface OlProps extends HTMLAttributes<HTMLOListElement> {
  variant?: Extract<TextVariant['variant'], 'muted'>;
}
interface LiProps extends HTMLAttributes<HTMLLIElement> {
  variant?: Extract<TextVariant['variant'], 'muted'>;
}
interface StrongProps extends HTMLAttributes<HTMLElement> {
  variant?: Extract<TextVariant['variant'], 'muted'>;
}
interface EmProps extends HTMLAttributes<HTMLElement> {
  variant?: Extract<TextVariant['variant'], 'muted'>;
}
interface InlineCodeProps extends HTMLAttributes<HTMLElement> {
  variant?: Extract<TextVariant['variant'], 'muted'>;
}

function H1({ variant, ...props }: HeadingProps) {
  return <h1 {...props} className={textVariants({ type: 'h1', variant })} />;
}
function H2({ variant, ...props }: HeadingProps) {
  return <h2 {...props} className={textVariants({ type: 'h2', variant })} />;
}
function H3({ variant, ...props }: HeadingProps) {
  return <h3 {...props} className={textVariants({ type: 'h3', variant })} />;
}
function H4({ variant, ...props }: HeadingProps) {
  return <h4 {...props} className={textVariants({ type: 'h4', variant })} />;
}
function H5({ variant, ...props }: HeadingProps) {
  return <h5 {...props} className={textVariants({ type: 'h5', variant })} />;
}
function H6({ variant, ...props }: HeadingProps) {
  return <h6 {...props} className={textVariants({ type: 'h6', variant })} />;
}
function P({ variant, ...props }: PProps) {
  return <p {...props} className={textVariants({ type: 'p', variant })} />;
}
function Small({ variant, ...props }: SmallProps) {
  return (
    <small {...props} className={textVariants({ type: 'small', variant })} />
  );
}
function Blockquote({ variant, ...props }: BlockquoteProps) {
  return (
    <blockquote
      {...props}
      className={textVariants({ type: 'blockquote', variant })}
    />
  );
}
function Ul({ variant, ...props }: UlProps) {
  return <ul {...props} className={textVariants({ type: 'ul', variant })} />;
}
function Ol({ variant, ...props }: OlProps) {
  return <ol {...props} className={textVariants({ type: 'ol', variant })} />;
}
function Li({ variant, ...props }: LiProps) {
  return <li {...props} className={textVariants({ type: 'li', variant })} />;
}
function Strong({ variant, ...props }: StrongProps) {
  return (
    <strong {...props} className={textVariants({ type: 'strong', variant })} />
  );
}
function Em({ variant, ...props }: EmProps) {
  return <em {...props} className={textVariants({ type: 'em', variant })} />;
}
function InlineCode({ variant, ...props }: InlineCodeProps) {
  return (
    <code
      {...props}
      className={textVariants({ type: 'inline-code', variant })}
    />
  );
}

export {
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
  InlineCode,
};

// const baseContainerMap = {
//   p: P,
//   h1: H1,
//   h2: H2,
//   h3: H3,
// 	h4: H4,
// 	h5: H5,
// 	h6: H6,
// } as const;

// type ContainerMap = typeof baseContainerMap &
//   Omit<ReactHTML, keyof typeof baseContainerMap>;

// function KeyValue<TContainer extends keyof ContainerMap = 'p'>({
//   name,
//   value,
//   container,
//   ...props
// }: {
//   container?: TContainer;
//   name: ReactNode;
//   value: ReactNode;
// } & Parameters<ContainerMap[TContainer]>[0]) {
//   const baseContainer = container ?? 'p';

//   const Container =
//     baseContainer in baseContainerMap
//       ? baseContainerMap[
//           baseContainer as unknown as keyof typeof baseContainerMap
//         ]
//       : baseContainer;

//   return (
//     // @ts-ignore
//     <Container {...props}>
//       <strong className="capitalize">{name}:</strong>&nbsp;{value}
//     </Container>
//   );
// }
