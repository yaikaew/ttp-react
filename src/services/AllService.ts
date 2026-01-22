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
