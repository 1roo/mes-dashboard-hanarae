import { type MenuNode } from "./menusConfig";

export default function findMenuTrail(
  nodes: MenuNode[],
  pathname: string,
): string[] | null {
  for (const node of nodes) {
    if (node.path === pathname) return [node.title];

    if (node.children?.length) {
      const childTrail = findMenuTrail(node.children, pathname);
      if (childTrail) return [node.title, ...childTrail];
    }
  }
  return null;
}
