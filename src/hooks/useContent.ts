import { useState, useEffect } from "react";
import { contentService } from "../services/AllService";

type AllData = Awaited<ReturnType<typeof contentService.getContent>>;

export const useContent = () => {
  const [contents, setContent] = useState<AllData>([]);
  const [loading, setLoading] = useState(true);

  const refreshContent = async () => {
    setLoading(true);
    try {
      const data = await contentService.getContent();
      setContent(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshContent();
  }, []);

  return { contents, loading, refreshContent };
};
