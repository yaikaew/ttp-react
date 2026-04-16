// useCalendar.ts
import { useState, useEffect, useCallback } from "react";
import { calendarService } from "../services/calendarService";

type CalendarFullData = Awaited<ReturnType<typeof calendarService.getEvents>>;

export const useCalendar = () => {
  // 1. เปลี่ยนจาก null เป็น []
  // 2. ลบ | null ออกจาก Type
  const [schedule, setSchedule] = useState<CalendarFullData>([]);
  const [loading, setLoading] = useState(true);

  const refreshSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const data = await calendarService.getEvents();
      setSchedule(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSchedule();
  }, [refreshSchedule]);

  return { schedule, loading, refreshSchedule };
};
