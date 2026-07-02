import { revalidatePath } from "next/cache";

export function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function validateTables(tables: unknown) {
  if (!tables || !Array.isArray(tables)) {
    return true;
  }

  for (const table of tables) {
    if (
      !table ||
      typeof table !== "object" ||
      !("title" in table) ||
      typeof table.title !== "string" ||
      !("columns" in table) ||
      !Array.isArray(table.columns) ||
      table.columns.length === 0 ||
      !("rows" in table) ||
      !Array.isArray(table.rows) ||
      table.rows.length === 0
    ) {
      return false;
    }

    for (const row of table.rows) {
      if (!Array.isArray(row) || row.length !== table.columns.length) {
        return false;
      }
    }
  }

  return true;
}

type TableLike = {
  title?: string;
  columns?: unknown[];
  rows?: unknown[];
};

export function filterValidTables<T extends TableLike>(tables: T[]): T[] {
  return tables.filter((table) => {
    return (
      table?.title &&
      Array.isArray(table.columns) &&
      table.columns.length > 0 &&
      Array.isArray(table.rows) &&
      table.rows.length > 0
    );
  });
}

export function revalidateContentPaths(type: string, slug?: string) {
  // Always revalidate root layout and homepage so that Navbar (jobs count), Breaking News, and Home feeds update immediately
  revalidatePath('/', 'layout');
  revalidatePath('/', 'page');
  revalidatePath('/sitemap.xml'); // Ensure sitemap updates when new content is added

  if (type === "job" && slug) {
    const paths = [
      `/jobs/${slug}`,
      `/results/${slug}`,
      `/answer-keys/${slug}`,
      `/syllabus/${slug}`,
      `/admit-cards/${slug}`,
      "/jobs",
    ];

    for (const path of paths) {
      revalidatePath(path);
    }

    return;
  }

  if (type === "job") {
    const paths = ["/jobs", "/results", "/answer-keys", "/syllabus", "/admit-cards"];
    for (const path of paths) {
      revalidatePath(path);
    }
    return;
  }

  if (type === "blog" && slug) {
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/blog");
    return;
  }

  if (type === "blog") {
    revalidatePath("/blog");
  }
}
