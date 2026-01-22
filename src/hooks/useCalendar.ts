// useCalendar.ts
import { useState, useEffect } from "react";
import { calendarService } from "../services/calendarService";

type CalendarFullData = Awaited<ReturnType<typeof calendarService.getEvents>>;

export const useCalendar = () => {
  // 1. เปลี่ยนจาก null เป็น []
  // 2. ลบ | null ออกจาก Type
  const [schedule, setSchedule] = useState<CalendarFullData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calendarService
      .getEvents()
      .then((data) => setSchedule(data)) // มั่นใจได้ว่า data จะเป็น array จาก service
      .finally(() => setLoading(false));
  }, []);

  return { schedule, loading };
};
