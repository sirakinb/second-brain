export type DocTreeNode = {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: DocTreeNode[];
};

export type DocFrontmatter = {
  title?: string;
  date?: string;
  tags?: string[];
};
