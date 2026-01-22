import { useState, useEffect } from "react";
import { filmService } from "../services/filmService";

// 1. แทนที่จะ Import Interface ที่เขียนเอง เราจะแกะ Type ออกจากฟังก์ชันใน Service เลย
// วิธีนี้ฉลาดมาก เพราะถ้า Service ดึงตารางเพิ่ม Type ใน Hook จะเปลี่ยนตามทันที
type FilmFullData = Awaited<ReturnType<typeof filmService.getFilmFullData>>;

export const useFilmData = (filmId: number) => {
  // 2. ใช้ Type ที่เราแกะออกมา (FilmFullData)
  const [film, setFilm] = useState<FilmFullData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await filmService.getFilmFullData(filmId);
        setFilm(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    if (filmId) {
      fetchData();
    }
  }, [filmId]);

  return { film, loading, error };
};
