import type { Click, UrlSummary } from "#/types/manage";

export const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(seed)}`;

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const extractUrls = (payload: unknown): UrlSummary[] => {
  const rows = Array.isArray(payload) ? payload : [payload];
  const unique = new Map<string, UrlSummary>();

  rows.forEach((row: any) => {
    if (!Array.isArray(row?.url)) return;
    row.url.forEach((item: any) => {
      if (!item?.customCode) return;
      unique.set(item.customCode, {
        id: item.id,
        destination: item.destination,
        customCode: item.customCode,
        createdAt: item.createdAt,
      });
    });
  });

  return [...unique.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export const countBy = (clicks: Click[], key: keyof Click) =>
  clicks.reduce(
    (acc, click) => {
      const value = (click[key] as string) || "unknown";
      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

export const getLast7Days = () =>
  Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    return day.toISOString().split("T")[0];
  });

export const getClicksByDay = (clicks: Click[], days: string[]) =>
  days.reduce(
    (acc, day) => {
      acc[day] = clicks.filter((click) =>
        click.createdAt.startsWith(day),
      ).length;
      return acc;
    },
    {} as Record<string, number>,
  );
