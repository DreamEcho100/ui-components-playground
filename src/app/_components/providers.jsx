"use client";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * @param {import('react').PropsWithChildren} props
 */
export default function Providers(props) {
  return (
    <TRPCReactProvider>
      {props.children}
      <ReactQueryDevtools />
      <Toaster />
    </TRPCReactProvider>
  );
}
