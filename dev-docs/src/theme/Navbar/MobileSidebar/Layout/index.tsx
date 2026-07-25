import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { usePluginData } from "@docusaurus/useGlobalData";
import DocSidebarItems from "@theme/DocSidebarItems";
import type { Props } from "@theme/Navbar/MobileSidebar/Layout";
import clsx from "clsx";
import type { ReactNode } from "react";
import { repositoryUrl } from "../../../../config/source";
import type { MobileDocsSidebarData } from "../../../../plugins/mobileDocsSidebar";
import styles from "./styles.module.css";

type UtilityLinkProps = {
  href: string;
  label: string;
};

function UtilityLink({ href, label }: UtilityLinkProps): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();

  return (
    <li className="menu__list-item">
      <Link
        className="menu__link"
        href={href}
        onClick={() => mobileSidebar.toggle()}
      >
        {label}
      </Link>
    </li>
  );
}

export default function NavbarMobileSidebarLayout({
  header,
}: Props): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const { pathname } = useLocation();
  const { sidebar } = usePluginData(
    "mobile-docs-sidebar",
  ) as MobileDocsSidebarData;

  return (
    <div
      className={clsx(
        ThemeClassNames.layout.navbar.mobileSidebar.container,
        "navbar-sidebar",
      )}
    >
      {header}
      <div className="navbar-sidebar__items">
        <div
          className={clsx(
            ThemeClassNames.layout.navbar.mobileSidebar.panel,
            "navbar-sidebar__item menu",
          )}
        >
          <ul className={`menu__list ${styles.homeLink}`}>
            <UtilityLink href="/" label="Home" />
          </ul>

          <ul
            className={clsx(ThemeClassNames.docs.docSidebarMenu, "menu__list")}
          >
            <DocSidebarItems
              items={sidebar}
              activePath={pathname}
              onItemClick={(item) => {
                if (item.type === "link") {
                  mobileSidebar.toggle();
                }

                if (item.type === "category" && item.href) {
                  mobileSidebar.toggle();
                }
              }}
              level={1}
            />
          </ul>

          <ul className={`menu__list ${styles.projectLinks}`}>
            <UtilityLink href={repositoryUrl} label="GitHub" />
          </ul>
        </div>
      </div>
    </div>
  );
}
