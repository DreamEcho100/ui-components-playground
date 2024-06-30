"use client";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";

/**
 * @param {import('react').PropsWithChildren} props
 */
export default function Providers(props) {
  return (
    <TRPCReactProvider>
      {props.children}
      <Toaster />
    </TRPCReactProvider>
  );
}
