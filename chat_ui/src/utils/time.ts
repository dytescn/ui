export const getDateLabel = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  if (date >= today) return "今天";
  if (date >= yesterday) return "昨天";
  if (date >= weekAgo) return "本周";
  if (date >= monthAgo) return "本月";
  return "更早";
};