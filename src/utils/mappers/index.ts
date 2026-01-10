import type { Database } from "../../types/supabase";

/* =======================
   DB Row Types
======================= */
type ArtistRow = Database["public"]["Tables"]["artist"]["Row"];
type EndorsementRow = Database["public"]["Tables"]["endorsements"]["Row"];
type ContentRow = Database["public"]["Tables"]["contents"]["Row"];
type MagazinesRow = Database["public"]["Tables"]["magazines"]["Row"];
type CalendarEventRow = Database["public"]["Tables"]["calendar"]["Row"];
type FilmographyRow = Database["public"]["Tables"]["filmography"]["Row"];
type DiscographyRow = Database["public"]["Tables"]["discography"]["Row"];
type PerformanceRow = Database["public"]["Tables"]["performance"]["Row"];
/* =======================
   JOIN Types
======================= */
type WithArtistName<T> = T & {
  artist: { name: string } | null;
};

/* =======================
   UI Models
======================= */
export interface ArtistUI {
  id: number;
  name: string;
}

export interface EndorsementUI {
  id: number;
  name: string;
  position: string;
  category: string;
  img: string;
  link: string;
  date: string;
  artistName: string;
}

export interface ContentUI {
  id: number;
  name: string;
  type: string;
  date: string;
  img: string;
  link: string;
  artistName: string;
}

export interface MagazinesUI {
  id: number;
  name: string;
  issue: string;
  date: string;
  img: string;
  promo_link: string;
  article_link: string;
  artistName: string;
}

export interface CalendarEventUI {
  id: number;
  name: string;
  date: string;
  time: string;
  artistName: string;
  poster: string;
  live: string;
  key: string;
  tag: string;
  info: string;
  link: string;
  location: string;
  note: string;
}

export interface FilmographyUI {
  id: number;
  artistName: string;
  title: string;
  date: string;
  poster: string;
  status: string;
  note: string;
  synopsis: string;
  rerun_link1: string;
  rerun_link2: string;
  role_teetee: string;
  role_por: string;
}

export interface DiscographyUI {
  id: number;
  artistName: string;
  title: string;
  date: string;
  img: string;
  mv: string;
  streaming: string;
  note: string;
}

export interface PerformanceUI {
  id: number;
  artistName: string;
  date: string;
  type: string;
  title: string;
  img: string;
  link: string;
  note: string;
}

/* =======================
   MAPPERS
======================= */

// artist
export const mapArtistRowToUI = (row: ArtistRow): ArtistUI => ({
  id: row.id,
  name: row.name,
});

// endorsements
export const mapEndorsementRowToUI = (
  row: WithArtistName<EndorsementRow>
): EndorsementUI => ({
  id: row.id,
  name: row.name ?? "",
  position: row.position ?? "",
  category: row.category ?? "",
  img: row.img ?? "",
  link: row.link ?? "",
  date: row.date ?? "",
  artistName: row.artist?.name ?? "Unknown",
});

// contents
export const mapContentRowToUI = (
  row: WithArtistName<ContentRow>
): ContentUI => ({
  id: row.id,
  name: row.name ?? "",
  type: row.type ?? "",
  date: row.date ?? "",
  img: row.img ?? "",
  link: row.link ?? "",
  artistName: row.artist?.name ?? "Unknown",
});

// magazines
export const mapMagazinesRowToUI = (
  row: WithArtistName<MagazinesRow>
): MagazinesUI => ({
  id: row.id,
  artistName: row.artist?.name ?? "Unknown",
  name: row.name ?? "",
  issue: row.issue ?? "",
  date: row.date ?? "",
  img: row.img ?? "",
  promo_link: row.promo_link ?? "",
  article_link: row.article_link ?? "",
});

// calendar events
export const mapCalendarEventRowToUI = (
  row: WithArtistName<CalendarEventRow>
): CalendarEventUI => ({
  id: row.id,
  name: row.name ?? "",
  date: row.date ?? "",
  time: row.time ?? "",

  // 👇 map ชื่อสั้น
  artistName: row.artist?.name ?? "Unknown",
  poster: row.poster_url ?? "",
  live: row.live_platform ?? "",
  key: row.keyword ?? "",
  tag: row.hashtag ?? "",
  info: row.info_link ?? "",
  link: row.rerun_link ?? "",

  location: row.location ?? "",
  note: row.note ?? "",
});

export const mapFilmographyRowToUI = (
  row: WithArtistName<FilmographyRow>
): FilmographyUI => ({
  id: row.id,
  title: row.title ?? "",
  date: row.date ?? "",
  role_teetee: row.role_teetee ?? "",
  role_por: row.role_por ?? "",
  status: row.status ?? "",
  synopsis: row.synopsis ?? "",
  poster: row.poster ?? "",
  artistName: row.artist?.name ?? "Unknown",
  note: row.note ?? "",
  rerun_link1: row.rerun_link1 ?? "",
  rerun_link2: row.rerun_link2 ?? "",
});

export const mapDiscographyRowToUI = (
  row: WithArtistName<DiscographyRow>
): DiscographyUI => ({
  id: row.id,
  artistName: row.artist?.name ?? "Unknown",
  title: row.title ?? "",
  date: row.date ?? "",
  img: row.img ?? "",
  mv: row.mv ?? "",
  streaming: row.streaming ?? "",
  note: row.note ?? "",
});

export const mapPerformanceRowToUI = (
  row: WithArtistName<PerformanceRow>
): PerformanceUI => ({
  id: row.id,
  artistName: row.artist?.name ?? "Unknown",
  date: row.date ?? "",
  title: row.title ?? "",
  type: row.type ?? "",
  img: row.img ?? "",
  link: row.link ?? "",
  note: row.note ?? "",
});
