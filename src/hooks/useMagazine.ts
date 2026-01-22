// useMagazine.ts
import { useState, useEffect } from "react";
import { magazineService } from "../services/magazineService";

type MagazineFullData = Awaited<ReturnType<typeof magazineService.getMagazine>>;

export const useMagazine = () => {
  const [magazine, setMagazine] = useState<MagazineFullData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    magazineService
      .getMagazine()
      .then((data) => setMagazine(data))
      .finally(() => setLoading(false));
  }, []);

  return { magazine, loading };
};
