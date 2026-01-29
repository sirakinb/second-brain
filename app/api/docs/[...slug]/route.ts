import { readDoc } from "@/lib/docs";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

export async function GET(
  _request: Request,
  { params }: { params: { slug?: string[] } },
) {
  const slug = params.slug ?? [];
  const relativePath = slug.map((segment) => decodeURIComponent(segment)).join("/");

  try {
    const doc = await readDoc(relativePath);
    const mdxSource = await serialize(doc.content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    });
    return Response.json({
      path: doc.path,
      frontmatter: doc.frontmatter,
      content: doc.content,
      mdxSource,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Not found";
    return Response.json({ error: message }, { status: 404 });
  }
}
