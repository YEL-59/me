"use client";

import VaultDossier from "@/components/portfolio/VaultDossier";
import { isPortfolioUnlocked } from "@/lib/portfolio-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PortfolioPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isPortfolioUnlocked()) {
      setAllowed(true);
    } else {
      router.replace("/");
    }
  }, [router]);

  if (!allowed) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-xs"
        style={{ color: "var(--text-tertiary)" }}
      >
        Verifying access…
      </div>
    );
  }

  return <VaultDossier />;
}
