export function isValidTimeRange(start: string, end: string): boolean {
  if (!start || !end) return true;
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);

  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  return endTime > startTime;
}