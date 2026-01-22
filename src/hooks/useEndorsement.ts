import { useState, useEffect } from "react";
import { endorsementService } from "../services/AllService";

type AllData = Awaited<ReturnType<typeof endorsementService.getEndorsement>>;

export const useEndorsement = () => {
  const [endorsement, setEndorsement] = useState<AllData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    endorsementService
      .getEndorsement()
      .then((data) => setEndorsement(data))
      .finally(() => setLoading(false));
  }, []);

  return { endorsement, loading };
};
