import { useQuery } from "@tanstack/react-query";
import { fetchMonthlyData } from "@/lib/monthly";

export function useMonthly() {
  return useQuery({
    queryKey: ["monthly"],
    queryFn: fetchMonthlyData,
  });
}
