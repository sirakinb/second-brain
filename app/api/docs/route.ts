import { writeDoc } from "@/lib/docs";

export async function POST(request: Request) {
  const body = await request.json();
  const { path, title, date, tags, content } = body ?? {};

  if (!path || typeof path !== "string") {
    return Response.json({ error: "Path is required." }, { status: 400 });
  }

  const normalized = await writeDoc({
    path,
    content: typeof content === "string" ? content : "",
    frontmatter: {
      title: typeof title === "string" ? title : undefined,
      date: typeof date === "string" ? date : undefined,
      tags: Array.isArray(tags) ? tags.filter((tag) => typeof tag === "string") : undefined,
    },
  });

  return Response.json({ path: normalized });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { path, content, frontmatter } = body ?? {};

  if (!path || typeof path !== "string") {
    return Response.json({ error: "Path is required." }, { status: 400 });
  }

  const normalized = await writeDoc({
    path,
    content: typeof content === "string" ? content : "",
    frontmatter: frontmatter ?? {},
  });

  return Response.json({ path: normalized });
}
