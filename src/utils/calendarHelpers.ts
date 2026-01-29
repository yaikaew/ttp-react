// Helper functions สำหรับ Calendar
export const getTimeFromDatetimetz = (datetimetz: string): string | null => {
  const dt = new Date(datetimetz);
  const hours = dt.getHours();
  const minutes = dt.getMinutes();
  // ถ้าเวลาเป็น 00:00 ถือว่าไม่มีเวลา (TBA)
  if (hours === 0 && minutes === 0) return null;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const getDateFromDatetimetz = (datetimetz: string): Date => {
  return new Date(datetimetz);
};
