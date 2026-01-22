import { supabase } from "../lib/supabaseClient";

export const filmService = {
  async getFilmFullData(filmId: number) {
    const { data, error } = await supabase
      .from("filmography")
      .select(
        `
        *,
        filmographydetail (*),
        filmographytrends (*)
      `,
      )
      .eq("id", filmId)
      .order("episode", { foreignTable: "filmographytrends", ascending: true })
      .single();

    if (error) throw error;

    return data;
  },
};
