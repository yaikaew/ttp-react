import { supabase } from "../lib/supabaseClient";

export type TimelineItem = {
  id: number;
  date: string;
  title: string;
  desc: string;
  imgs: string[];
};

export const timelineService = {
  async getTimeline() {
    const { data, error } = await supabase
      .from("timeline")
      .select(`*`,)
      .order("date", { ascending: false });

    if (error) throw error;

    return (
      (data as any[])
        .map((item) => {
          let imgs: string[] = [];

          if (Array.isArray(item.imgs)) {
            imgs = item.imgs.filter(Boolean).map(String);
          } else if (typeof item.imgs === "string") {
            try {
              const parsed = JSON.parse(item.imgs);
              if (Array.isArray(parsed)) {
                imgs = parsed.filter(Boolean).map(String);
              } else {
                imgs = item.imgs.split(",").map((src: string) => src.trim()).filter(Boolean);
              }
            } catch {
              imgs = item.imgs.split(",").map((src: string) => src.trim()).filter(Boolean);
            }
          }

          return {
            id: item.id,
            date: item.date,
            title: item.title,
            desc: item.description || "",
            imgs,
          };
        }) as TimelineItem[]
    );
  },
};
