export type ContentCollection = "problems" | "research";

export type ContentMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tag: string;
};

export type ContentEntry = {
  meta: ContentMeta;
  body: string;
};
