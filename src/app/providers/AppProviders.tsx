import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../../auth/AuthProvider";
import { queryClient } from "../queryClient";

type Props = {
  children: ReactNode;
};

export default function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-left" />
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
