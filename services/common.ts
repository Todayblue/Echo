import {SearchQuery} from "@/types/common";
import axios from "axios";

export const GetSearchQuery = async (query: string, type: string) => {
const {data} = await axios.get<any[]>(`/api/search?q=${query}&type=${type}`);

  return data;
};
