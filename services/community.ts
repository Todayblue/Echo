import axios from "axios";
import {Community} from "@prisma/client";
import {CommunityDetails, DropdownOption} from "@/types/common";
import {PostCreationRequest} from "@/lib/validators/post";

export const GetCommunityDetailsById = async (id: string) => {
  const {data} = await axios.get<CommunityDetails>(
    `/api/community/details?id=${id}`
  );
  return data;
};

export const GetCommunityBySlug = async (slug: string) => {
  const {data} = await axios.get<Community>(`/api/community/${slug}`);
  return data;
};

export const GetCommunityDDL = async () => {
  const {data} = await axios.get<DropdownOption[]>("/api/community/dropdown");
  return data;
};

export const createSubCommuPost = async (payload: PostCreationRequest) => {
  const {data} = await axios.post("/api/posts", payload);

  return data;
};