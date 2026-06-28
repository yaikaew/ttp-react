import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useFilmData = (id?: number | null) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [film, setFilm] = useState<any | null>(null);
  const [filmographydetail, setFilmographydetail] = useState<any | null>(null);
  const [filmographytrends, setFilmographytrends] = useState<any[]>([]);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const { data: filmData, error: filmError } = await supabase
          .from('filmography')
          .select('*, artist:artist_id ( name )')
          .eq('id', id)
          .maybeSingle();
        if (filmError) throw filmError;

        const { data: detailData, error: detailError } = await supabase
          .from('filmographydetail')
          .select('*')
          .eq('filmography_id', id)
          .maybeSingle();
        if (detailError) throw detailError;

        const { data: trendsData, error: trendsError } = await supabase
          .from('filmographytrends')
          .select('*')
          .eq('filmography_id', id)
          .order('air_date', { ascending: true });
        if (trendsError) throw trendsError;

        if (!mounted) return;
        setFilm(
          filmData
            ? {
                ...filmData,
                filmographydetail: detailData,
                filmographytrends: trendsData || [],
              }
            : null,
        );
        setFilmographydetail(detailData || null);
        setFilmographytrends(trendsData || []);
      } catch (err) {
        if (!mounted) return;
        setError(err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  return { film, filmographydetail, filmographytrends, loading, error } as const;
};
