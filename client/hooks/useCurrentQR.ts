import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type CurrentQR = {
  uuid: string;
  generatedAt: number;
};

import apiClient from "@/api/index";

export function useCurrentQR(token?: string | null) {
  console.log(token);

  const query = useQuery({
    queryKey: ["qr", "current"],
    enabled: !!token,
    refetchInterval: 60_000,
    queryFn: async (): Promise<CurrentQR> => {
      const res = await apiClient.get(`/qr/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: CurrentQR = res.data?.data;
      if (!data?.uuid) throw new Error("Invalid QR response");
      return data;
    },
  });

  return {
    qr: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error
      ? ((query.error as any)?.message ?? "Failed to load QR")
      : null,
    refetch: query.refetch,
  };
}
