// Helper functions สำหรับ Calendar
export const getTimeFromDatetimetz = (datetimetz: string): string | null => {
  if (!datetimetz) return null;

  const dt = new Date(datetimetz);
  const time = dt.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return time === '00:00' ? null : time;
};

export const getDatetimeLocalValueFromBangkokDatetimetz = (datetimetz: string): string => {
  if (!datetimetz) return '';

  const dt = new Date(datetimetz);
  const localValue = dt.toLocaleString('sv-SE', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return localValue.replace(' ', 'T').slice(0, 16);
};

export const getDateFromDatetimetz = (datetimetz: string): Date => {
  return new Date(datetimetz);
};
