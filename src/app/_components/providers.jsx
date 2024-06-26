'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '~/components/ui/sonner';

const queryClient = new QueryClient();

/**
 * @param {import('react').PropsWithChildren} props
 */
export default function Providers(props) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      <Toaster />
    </QueryClientProvider>
  );
}
