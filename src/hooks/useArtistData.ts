import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import type { Database } from "../types/supabase";

import {
  mapArtistRowToUI,
  mapEndorsementRowToUI,
  mapContentRowToUI,
  mapMagazinesRowToUI,
  mapCalendarEventRowToUI,
  mapFilmographyRowToUI,
  mapDiscographyRowToUI,
  mapPerformanceRowToUI,
  type ArtistUI,
  type EndorsementUI,
  type ContentUI,
  type MagazinesUI,
  type CalendarEventUI,
  type FilmographyUI,
  type DiscographyUI,
  type PerformanceUI,
} from "../utils/mappers";

/* =======================
   DB Row Types
======================= */
// type ArtistRow =
//   Database['public']['Tables']['artist']['Row'];

type EndorsementRow = Database["public"]["Tables"]["endorsements"]["Row"];
type ContentRow = Database["public"]["Tables"]["contents"]["Row"];
type MagazinesRow = Database["public"]["Tables"]["magazines"]["Row"];
type CalendarEventRow = Database["public"]["Tables"]["calendar"]["Row"];
type FilmographyRow = Database["public"]["Tables"]["filmography"]["Row"];
type DiscographyRow = Database["public"]["Tables"]["discography"]["Row"];
type PerformanceRow = Database["public"]["Tables"]["performance"]["Row"];
type WithArtist<T> = T & {
  artist: { name: string } | null;
};

/* =======================
   ARTISTS
======================= */
export const useArtists = () => {
  return useQuery<ArtistUI[]>({
    queryKey: ["artists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artist")
        .select("id, name")
        .order("name");

      if (error) throw error;
      if (!data) return [];

      return data.map(mapArtistRowToUI);
    },
  });
};
export const useArtistById = (artistId?: number) => {
  return useQuery<ArtistUI | null>({
    queryKey: ["artist", artistId],
    enabled: !!artistId, // ไม่ยิง query ถ้าไม่มี id
    queryFn: async () => {
      if (!artistId) return null;

      const { data, error } = await supabase
        .from("artist")
        .select("id, name")
        .eq("id", artistId)
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapArtistRowToUI(data);
    },
  });
};

/* =======================
   ENDORSEMENTS
======================= */
export const useEndorsements = (sortOrder: "asc" | "desc") => {
  return useQuery<EndorsementUI[]>({
    queryKey: ["endorsements", sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("endorsements")
        .select("*, artist:artist_id ( name )")
        .order("date", { ascending: sortOrder === "asc" });

      if (error) throw error;
      if (!data) return [];

      return (data as WithArtist<EndorsementRow>[]).map(mapEndorsementRowToUI);
    },
  });
};

/* =======================
   CONTENTS
======================= */
export const useContents = (sortOrder: "asc" | "desc") => {
  return useQuery<ContentUI[]>({
    queryKey: ["contents", sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contents")
        .select("*, artist:artist_id ( name )")
        .order("date", { ascending: sortOrder === "asc" });

      if (error) throw error;
      if (!data) return [];

      return (data as WithArtist<ContentRow>[]).map(mapContentRowToUI);
    },
  });
};

/* =======================
   MAGAZINES
======================= */
export const useMagazines = (sortOrder: "asc" | "desc") => {
  return useQuery<MagazinesUI[]>({
    queryKey: ["magazines", sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("magazines")
        .select("*, artist:artist_id ( name )")
        .order("date", { ascending: sortOrder === "asc" });

      if (error) throw error;
      if (!data) return [];

      return (data as WithArtist<MagazinesRow>[]).map(mapMagazinesRowToUI);
    },
  });
};

/* =======================
   CALENDAR EVENTS
======================= */
export const useCalendarEvents = (sortOrder: "asc" | "desc") => {
  return useQuery<CalendarEventUI[]>({
    queryKey: ["calendar-events", sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar")
        .select("*, artist:artist_id ( name )")
        .order("date", { ascending: sortOrder === "asc" });

      if (error) throw error;
      if (!data) return [];

      return (data as WithArtist<CalendarEventRow>[]).map(
        mapCalendarEventRowToUI
      );
    },
  });
};

export const useFilmography = (sortOrder: "asc" | "desc") => {
  return useQuery<FilmographyUI[]>({
    queryKey: ["filmography", sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filmography")
        .select("*, artist:artist_id ( name )")
        .order("date", { ascending: sortOrder === "asc" });

      if (error) throw error;
      if (!data) return [];

      return (data as WithArtist<FilmographyRow>[]).map(mapFilmographyRowToUI);
    },
  });
};

export const useDiscography = (sortOrder: "asc" | "desc") => {
  return useQuery<DiscographyUI[]>({
    queryKey: ["discography", sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discography")
        .select("*, artist:artist_id ( name )")
        .order("date", { ascending: sortOrder === "asc" });

      if (error) throw error;
      if (!data) return [];

      return (data as WithArtist<DiscographyRow>[]).map(mapDiscographyRowToUI);
    },
  });
};

export const usePerformance = (sortOrder: "asc" | "desc") => {
  return useQuery<PerformanceUI[]>({
    queryKey: ["performance", sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("performance")
        .select("*, artist:artist_id ( name )")
        .order("date", { ascending: sortOrder === "asc" });

      if (error) throw error;
      if (!data) return [];

      return (data as WithArtist<PerformanceRow>[]).map(mapPerformanceRowToUI);
    },
  });
};
