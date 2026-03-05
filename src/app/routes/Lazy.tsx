import { Suspense } from "react";
import type { ReactNode } from "react";
import Spinner from "../../shared/ui/Spinner";

export default function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Spinner />}>{children}</Suspense>;
}
