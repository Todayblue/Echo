export interface ICommunity {
  id: string;
  name: string;
  creatorId: string;
  slug?: string;
}

export interface OptionType {
  label: string;
  value: string;
}
