
const slugify = require("slugify");
export const generateSlug = (text: string) => {
  const slug = slugify(text, "-".toLowerCase());

  return slug
}
