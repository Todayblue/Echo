import {LIMIT_POST, SEARCH_POSTS_PER_PAGE} from "@/lib/constants";
import {ExtendedPost, PopularCommunities} from "@/types";
import axios from "axios";

export const GetSearchQuery = async (
  pageParam: number,
  query: string,
  type: string,
  sort: string,
  timeFilter: string
) => {
  const {data} = await axios.get<any[]>(
    `/api/search?q=${query}&type=${type}&page=${pageParam}&limit=${SEARCH_POSTS_PER_PAGE}&sort=${sort}${sort === "new" ? "" : `&time=${timeFilter}`}`
  );

  return data;
};

export const getPopularCommunities = async () => {
  const {data} = await axios.get<PopularCommunities[]>(
    `/api/community/poppular`
  );

  return data;
};

export const getPosts = async (
  pageParam: number,
  communitySlug: string,
  time: string,
  sort: string
) => {
  const {data} = await axios.get<ExtendedPost[]>(
    `/api/posts?page=${pageParam}&limit=${LIMIT_POST}${communitySlug.length > 0 ? `&community=${communitySlug}` : ""}&sort=${sort}&time=${time}`
  );

  return data;
};
