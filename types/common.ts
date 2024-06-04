import {Community, Rule, Subscription} from "@prisma/client";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface CommunityDetails extends Community {
  rule: Rule[];
  subscribers: Subscription[];
  _count: {
    subscribers: number;
  };
}

export interface SearchQuery {
  query: string;
  type: string;
}
