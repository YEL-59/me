"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchPortfolioBundle,
  type PortfolioBundle,
} from "@/lib/portfolio-api";

type PortfolioContextValue = {
  data: PortfolioBundle | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextValue>({
  data: null,
  loading: true,
  refresh: async () => undefined,
});

export function PortfolioProvider({
  children,
  initialData = null,
}: {
  children: ReactNode;
  initialData?: PortfolioBundle | null;
}) {
  const [data, setData] = useState<PortfolioBundle | null>(initialData);
  const [loading, setLoading] = useState(!initialData);

  const refresh = async () => {
    setLoading(true);
    const bundle = await fetchPortfolioBundle();
    setData(bundle);
    setLoading(false);
  };

  useEffect(() => {
    if (!initialData) {
      void refresh();
    }
  }, [initialData]);

  const value = useMemo(
    () => ({ data, loading, refresh }),
    [data, loading]
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
