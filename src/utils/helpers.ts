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

export const formatDateKey = (date: Date) =>
  date.toISOString().split("T")[0];

export const getLastNDays = (days: number) =>
  Array.from({ length: days }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (days - 1 - index));
    return formatDateKey(day);
  });

export const getDaysRange = (start: string, end: string) => {
  if (!start || !end) return [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return [];
  }

  const from = startDate <= endDate ? startDate : endDate;
  const to = startDate <= endDate ? endDate : startDate;
  const days = [] as string[];
  const cursor = new Date(from);

  while (cursor <= to) {
    days.push(formatDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
};

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

const pad2 = (value: number) => String(value).padStart(2, "0");

export const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;

export const formatWeekKey = (date: Date) => {
  const day = date.getDay();
  const diff = (day + 6) % 7; // Monday start
  const start = new Date(date);
  start.setDate(start.getDate() - diff);
  return formatDateKey(start);
};

export const formatRangeLabel = (start: Date, end: Date) =>
  `${start.toLocaleDateString("en", { month: "short", day: "numeric" })}-${end.toLocaleDateString("en", { month: "short", day: "numeric" })}`;

export const buildTimelineSeries = ({
  clicks,
  range,
  customStart,
  customEnd,
}: {
  clicks: Click[];
  range: "7d" | "30d" | "365d" | "custom";
  customStart: string;
  customEnd: string;
}) => {
  const today = new Date();
  const start =
    range === "7d"
      ? new Date(new Date().setDate(today.getDate() - 6))
      : range === "30d"
        ? new Date(new Date().setDate(today.getDate() - 29))
        : range === "365d"
          ? new Date(new Date().setDate(today.getDate() - 364))
          : customStart
            ? new Date(customStart)
            : null;
  const end =
    range === "custom" && customEnd ? new Date(customEnd) : today;

  if (!start || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return [] as { label: string; value: number; tooltip: string }[];
  }

  const from = start <= end ? start : end;
  const to = start <= end ? end : start;
  const spanDays = Math.max(
    1,
    Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1,
  );

  const resolution =
    range === "7d"
      ? "day"
      : range === "30d"
        ? "week"
        : range === "365d"
          ? "month"
          : spanDays <= 31
            ? "day"
            : spanDays <= 180
              ? "week"
              : "month";

  if (resolution === "day") {
    const days = getDaysRange(formatDateKey(from), formatDateKey(to));
    const counts = getClicksByDay(clicks, days);
    return days.map((day) => ({
      label: new Date(day).toLocaleDateString("en", { weekday: "short" }),
      value: counts[day] ?? 0,
      tooltip: `${new Date(day).toLocaleDateString("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}: ${counts[day] ?? 0} clicks`,
    }));
  }

  if (resolution === "week") {
    const buckets = new Map<string, { start: Date; end: Date; count: number }>();
    const cursor = new Date(from);
    cursor.setHours(0, 0, 0, 0);
    while (cursor <= to) {
      const weekKey = formatWeekKey(cursor);
      if (!buckets.has(weekKey)) {
        const startOfWeek = new Date(weekKey);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        buckets.set(weekKey, { start: startOfWeek, end: endOfWeek, count: 0 });
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    clicks.forEach((click) => {
      const date = new Date(click.createdAt);
      if (date < from || date > to) return;
      const weekKey = formatWeekKey(date);
      const bucket = buckets.get(weekKey);
      if (bucket) bucket.count += 1;
    });

    return [...buckets.values()]
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .map((bucket) => ({
        label: formatRangeLabel(bucket.start, bucket.end),
        value: bucket.count,
        tooltip: `${formatRangeLabel(bucket.start, bucket.end)}: ${bucket.count} clicks`,
      }));
  }

  const months = new Map<string, { start: Date; count: number }>();
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
  while (cursor <= to) {
    const key = formatMonthKey(cursor);
    months.set(key, { start: new Date(cursor), count: 0 });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  clicks.forEach((click) => {
    const date = new Date(click.createdAt);
    if (date < from || date > to) return;
    const key = formatMonthKey(date);
    const bucket = months.get(key);
    if (bucket) bucket.count += 1;
  });

  return [...months.values()]
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .map((bucket) => ({
      label: bucket.start.toLocaleDateString("en", { month: "short" }),
      value: bucket.count,
      tooltip: `${bucket.start.toLocaleDateString("en", {
        month: "long",
        year: "numeric",
      })}: ${bucket.count} clicks`,
    }));
};
