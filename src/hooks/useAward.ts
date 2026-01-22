import { useState, useEffect } from "react";
import { awardService } from "../services/AllService";

type AllData = Awaited<ReturnType<typeof awardService.getAward>>;

export const useAward = () => {
  const [award, setAward] = useState<AllData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    awardService
      .getAward()
      .then((data) => setAward(data))
      .finally(() => setLoading(false));
  }, []);

  return { award, loading };
};
