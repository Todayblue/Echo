import {type ClassValue, clsx} from "clsx";
import {formatDistanceToNowStrict} from "date-fns";
import {twMerge} from "tailwind-merge";
import locale from "date-fns/locale/th";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatDistanceLocale = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "just now",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "in " + result;
    } else {
      if (result === "just now") return result;
      return result + " ago";
    }
  }

  return result;
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  });
}

export const getTimeRange = (time: string | null | undefined): {start: Date; end: Date} => {
  const now = new Date();
  switch (time) {
    case "year":
      return {
        start: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        end: now,
      };
    case "month":
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: now,
      };
    case "week":
      return {
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        end: now,
      };
    case "day":
      return {
        start: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        end: now,
      };
    case "hour":
      return {
        start: new Date(now.getTime() - 60 * 60 * 1000),
        end: now,
      };
    default:
      return {start: new Date(0), end: now};
  }
};

export const getSortBy = (
  sort: string | null | undefined,
  query: string,
  start: Date,
  end: Date
) => {
  let sortBy = {};
  let whereClause = {
    title: { search: query, mode: "insensitive" },
    createdAt: {gte: start, lte: end},
    votes: {},
  };
  switch (sort) {
    case "relevance":
      sortBy = {
        _relevance: {
          fields: ["title"],
          search: query,
          sort: "asc",
        },
      };
      break;
    case "new":
      sortBy = {
        createdAt: "desc",
      };
      break;
    case "comments":
      sortBy = {
        comments: {
          _count: "desc",
        },
      };
      break;
    case "votes":
      sortBy = {
        votes: {
          _count: "desc",
        },
      };
      whereClause = {
        title: {search: query, mode: "insensitive"},
        createdAt: {gte: start, lte: end},
        votes: {
          every: {
            type: "UP",
          },
        },
      };
      break;
    default:
      break;
  }
  return {sortBy, whereClause};
};

export const getSortByPosts = (
  community: string | null | undefined,
  sort: string | null | undefined,
  start: Date,
  end: Date
) => {
  let sortBy = {};
  let whereClause: any = {};

  if (community) {
    whereClause.community = { slug: community };
  }
  whereClause.createdAt = { gte: start, lte: end };

  switch (sort) {
    case "new":
      sortBy = {
        createdAt: "desc",
      };
      break;
    case "comments":
      sortBy = {
        comments: {
          _count: "desc",
        },
      };
      break;
    case "votes":
      sortBy = {
        votes: {
          _count: "desc",
        },
      };
      whereClause.votes = {
        every: {
          type: "UP",
        },
      };
      break;
    default:
      break;
  }
  return { sortBy, whereClause };
};
