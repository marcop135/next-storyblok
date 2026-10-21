export function sourceUrl(path: string | undefined, repo: string): string | null {
  if (!path || !/^(src|storyblok)\/[\w./[\]-]+$/.test(path) || path.split("/").includes("..")) return null;
  return `${repo}/blob/main/${path}`;
}
