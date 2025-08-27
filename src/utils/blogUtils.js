export const transformRankyakBlog = (rankyakPost) => {
  const defaultAuthor = "Titans Careers Editorial Team";
  const defaultAuthorImage = "/favicon.ico";
  const defaultCategory = "Uncategorized";
  const defaultTags = [];

  return {
    id: rankyakPost.id,
    title: rankyakPost.title || "Untitled Blog Post",
    slug: rankyakPost.slug,
    author: defaultAuthor,
    authorRole: "", // As per user's request
    authorImage: defaultAuthorImage,
    date: rankyakPost.published_at
      ? new Date(rankyakPost.published_at).toLocaleDateString()
      : new Date().toLocaleDateString(),
    category: defaultCategory,
    tags: defaultTags,
    image: rankyakPost.header_image_url || "/placeholder.svg",
    excerpt: rankyakPost.excerpt || "",
    htmlContent: rankyakPost.html || "",
    markdownContent: rankyakPost.markdown || "",
    // Original content function for compatibility, though it won't be used for Rankyak posts
    content: function () {
      return this.htmlContent;
    },
  };
};
