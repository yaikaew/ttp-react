import { useState, useEffect } from "react";
import { contentService } from "../services/AllService";

type AllData = Awaited<ReturnType<typeof contentService.getContent>>;

export const useContent = () => {
  const [contents, setContent] = useState<AllData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentService
      .getContent()
      .then((data) => setContent(data))
      .finally(() => setLoading(false));
  }, []);

  return { contents, loading };
};
