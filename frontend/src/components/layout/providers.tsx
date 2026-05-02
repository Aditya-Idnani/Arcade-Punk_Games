"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/use-app-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const hydrateAuth = useAppStore((s) => s.hydrateAuth);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  return <>{children}</>;
}
