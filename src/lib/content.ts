import path from "node:path";
import { promises as fs } from "node:fs";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

import type {
  ContentCollection,
  ContentEntry,
  ContentMeta,
} from "@/types/content";

const CONTENT_DIR = path.join(process.cwd(), "content");

const collectionPath = (collection: ContentCollection) =>
  path.join(CONTENT_DIR, collection);

const sortByDateDesc = (a: ContentMeta, b: ContentMeta) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

async function parseFile(
  collection: ContentCollection,
  slug: string,
): Promise<ContentEntry> {
  const filePath = path.join(collectionPath(collection), `${slug}.md`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  const meta: ContentMeta = {
    slug,
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString(),
    summary: data.summary ?? "",
    tag: data.tag ?? data.platform ?? "",
  };

  return {
    meta,
    body: processed.toString(),
  };
}

export async function getCollectionMeta(
  collection: ContentCollection,
): Promise<ContentMeta[]> {
  const dir = await fs.readdir(collectionPath(collection));
  const entries = await Promise.all(
    dir
      .filter((file) => file.endsWith(".md"))
      .map((file) => parseFile(collection, file.replace(/\.md$/, ""))),
  );

  return entries.map((entry) => entry.meta).sort(sortByDateDesc);
}

export async function getCollectionEntry(
  collection: ContentCollection,
  slug: string,
): Promise<ContentEntry> {
  return parseFile(collection, slug);
}

export async function getCollectionSlugs(
  collection: ContentCollection,
): Promise<string[]> {
  const dir = await fs.readdir(collectionPath(collection));
  return dir
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}
