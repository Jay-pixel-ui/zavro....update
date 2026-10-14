// Publish an article by adding a record with published: true after review.
// Fields: slug, title, description, category, author, publishedAt, updatedAt, body: [{h, p: []}], related: [slugs]
export const CATEGORIES = ["AI & automation", "Web & software", "Search & GEO", "Brand & strategy"];

export const INSIGHTS = [];

export const publishedInsights = () =>
  INSIGHTS.filter((a) => a.published).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
