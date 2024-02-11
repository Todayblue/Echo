export const calSkip = (page: number, limit: number) => {
  return (page - 1) * limit;
};
