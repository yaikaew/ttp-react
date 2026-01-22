import { useState, useEffect } from "react";
import { discographyService } from "../services/AllService";

type AllData = Awaited<ReturnType<typeof discographyService.getDiscography>>;

export const useDiscography = () => {
  const [discography, setDiscography] = useState<AllData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    discographyService
      .getDiscography()
      .then((data) => setDiscography(data))
      .finally(() => setLoading(false));
  }, []);

  return { discography, loading };
};
