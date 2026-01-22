// magazineService.ts
import { supabase } from "../lib/supabaseClient";

export const magazineService = {
  async getMagazine() {
    const { data, error } = await supabase
      .from("magazines")
      .select(
        `
        *,
        artist:artist_id ( name )
      `,
      )
      .order("date", { ascending: true }); // เรียงจากวันที่ใกล้ที่สุดไปไกลที่สุด

    if (error) throw error;
    return data || [];
  },
};
