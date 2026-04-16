// calendarService.ts
import { supabase } from "../lib/supabaseClient";

export const calendarService = {
  async getEvents() {
    const { data, error } = await supabase
      .from("calendar")
      .select(
        `
        *,
        artist:artist_id ( name )
      `,
      )
      .order("datetimetz", { ascending: true }); // เรียงตาม timestamp with time zone (วันที่และเวลา)

    if (error) throw error;
    return data || [];
  },

  async getArtists() {
    const { data, error } = await supabase
      .from("artist")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async updateEvent(id: number, updates: Partial<{
    artist_id: number;
    datetimetz: string;
    dmd: string | null;
    hashtag: string | null;
    info_link: string | null;
    keyword: string | null;
    live_platform: string | null;
    location: string | null;
    name: string;
    note: string | null;
    outfit: string | null;
    outfit_img: string | null;
    poster_url: string | null;
    rerun_link: string | null;
  }>) {
    const { data, error } = await supabase
      .from("calendar")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  },

  async deleteEvent(id: number) {
    const { error } = await supabase
      .from("calendar")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
