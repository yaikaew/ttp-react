import { useState, useEffect } from "react";
import { filmographyService } from "../services/AllService";

type AllData = Awaited<ReturnType<typeof filmographyService.getFilmography>>;

export const useFilmography = () => {
  const [filmography, setFilmography] = useState<AllData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    filmographyService
      .getFilmography()
      .then((data) => setFilmography(data))
      .finally(() => setLoading(false));
  }, []);

  return { filmography, loading };
};
