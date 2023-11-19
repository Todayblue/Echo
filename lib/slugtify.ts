
const slugify = require("slugify");
export const generateSlug = (text: string) => {
  const slug = slugify(text, "-");

  return slug.toLowerCase();
}
