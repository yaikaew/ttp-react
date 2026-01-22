import { useState, useEffect } from "react";
import { performanceService } from "../services/AllService";

type AllData = Awaited<ReturnType<typeof performanceService.getPerformance>>;

export const usePerformance = () => {
  const [perf, setPerf] = useState<AllData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceService
      .getPerformance()
      .then((data) => setPerf(data))
      .finally(() => setLoading(false));
  }, []);

  return { perf, loading };
};
