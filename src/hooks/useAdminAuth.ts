import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

import type { User, Session } from "@supabase/supabase-js";

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ระบุ Type ให้ชัดเจนในฟังก์ชัน
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        setUser(session?.user ?? null);
        setLoading(false);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
};
