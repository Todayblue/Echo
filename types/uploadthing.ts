export type UploadFileResponse<TServerOutput> = {
  name: string;
  size: number;
  key: string;
  url: string;

  // Matches what's returned from the serverside `onUploadComplete` callback
  // Will be `null` if `skipPolling` is set to `true`.
  serverdata: TServerOutput;
};
