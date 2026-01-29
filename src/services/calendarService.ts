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
};
