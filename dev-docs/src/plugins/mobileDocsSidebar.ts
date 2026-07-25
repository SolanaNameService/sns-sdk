import type {
  LoadedContent,
  PropSidebar,
} from "@docusaurus/plugin-content-docs";
import { toSidebarsProp } from "@docusaurus/plugin-content-docs/lib/props.js";
import type { Plugin } from "@docusaurus/types";

export type MobileDocsSidebarData = {
  sidebar: PropSidebar;
};

function collapseCategories(sidebar: PropSidebar): PropSidebar {
  return sidebar.map((item) =>
    item.type === "category"
      ? {
          ...item,
          collapsed: true,
          items: collapseCategories(item.items),
        }
      : item,
  );
}

export default function mobileDocsSidebarPlugin(): Plugin {
  return {
    name: "mobile-docs-sidebar",
    allContentLoaded({ allContent, actions }) {
      const docsContent = allContent["docusaurus-plugin-content-docs"]
        ?.default as LoadedContent | undefined;
      const currentVersion = docsContent?.loadedVersions.find(
        (version) => version.isLast,
      );

      if (!currentVersion) {
        throw new Error("Unable to load the current documentation version.");
      }

      const sidebar = toSidebarsProp(currentVersion).docsSidebar;

      if (!sidebar) {
        throw new Error('Unable to load the "docsSidebar" sidebar.');
      }

      actions.setGlobalData({
        sidebar: collapseCategories(sidebar),
      } satisfies MobileDocsSidebarData);
    },
  };
}
