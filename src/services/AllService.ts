// AllService.ts
import { supabase } from "../lib/supabaseClient";

export const contentService = {
  async getContent() {
    const { data, error } = await supabase
      .from("contents")
      .select(`*,artist:artist_id ( name )`)
      .order("date", { ascending: true });
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

  async createContent(insert: {
    artist_id: number;
    name: string;
    type?: string | null;
    date: string;
    img?: string | null;
    link?: string | null;
  }) {
    const { data, error } = await supabase
      .from("contents")
      .insert(insert)
      .select(`*,artist:artist_id ( name )`);

    if (error) throw error;
    return data?.[0] ?? null;
  },
};

export const discographyService = {
  async getDiscography() {
    const { data, error } = await supabase
      .from("discography")
      .select(`*,artist:artist_id ( name )`)
      .order("date", { ascending: true });
    if (error) throw error;
    return data || [];
  },
};

export const filmographyService = {
  async getFilmography() {
    const { data, error } = await supabase
      .from("filmography")
      .select(`*,artist:artist_id ( name )`)
      .order("date", { ascending: true });
    if (error) throw error;
    return data || [];
  },
};

export const performanceService = {
  async getPerformance() {
    const { data, error } = await supabase
      .from("performance")
      .select(`*,artist:artist_id ( name )`)
      .order("date", { ascending: true });
    if (error) throw error;
    return data || [];
  },
};

export const awardService = {
  async getAward() {
    const { data, error } = await supabase
      .from("awards")
      .select(`*,artist:artist_id ( name )`)
      .order("date", { ascending: true });
    if (error) throw error;
    return data || [];
  },
};

export const endorsementService = {
  async getEndorsement() {
    const { data, error } = await supabase
      .from("endorsements")
      .select(`*,artist:artist_id ( name )`)
      .order("date", { ascending: true });
    if (error) throw error;
    return data || [];
  },
};
