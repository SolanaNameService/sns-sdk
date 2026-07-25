import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { themes as prismThemes } from "prism-react-renderer";
import { repositoryUrl, sourceRevision } from "./src/config/source";

const config: Config = {
  title: "SNS Developer Documentation",
  tagline: "Build with SNS",
  favicon: "img/logo.svg",
  url: "https://dev.sns.id",
  baseUrl: "/",
  customFields: {
    cutoffSlot: 452_825_395,
  },
  organizationName: "SNS",
  projectName: "sns-sdk",
  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "docs",
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: ["./src/plugins/mobileDocsSidebar.ts"],
  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        indexDocs: true,
        indexPages: true,
        indexBlog: false,
        docsRouteBasePath: "/docs",
        searchBarShortcutHint: true,
      },
    ],
  ],
  themeConfig: {
    image: "img/social-card.svg",
    metadata: [
      {
        name: "description",
        content:
          "SDKs, React hooks, CLI, Proxy, and migration documentation for SNS.",
      },
    ],
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    announcementBar: {
      id: "sns_suffix_migration",
      content:
        '<strong>Action required:</strong> Upgrade for .sns support and update displayed domain names. <a href="/docs/migration/">Migrate now</a>',
      backgroundColor: "#b4fc75",
      textColor: "#102218",
      isCloseable: true,
    },
    navbar: {
      title: "SNS Developers",
      hideOnScroll: true,
      logo: {
        alt: "SNS",
        src: "img/logo.svg",
      },
      items: [
        { to: "/docs/migration/", label: "Migration", position: "left" },
        {
          to: "/docs/sdks/javascript/installation",
          label: "SDKs",
          position: "left",
        },
        {
          to: "/docs/sdk-proxy/quickstart",
          label: "SDK Proxy",
          position: "left",
        },
        {
          to: "/docs/react-hooks/installation",
          label: "React Hooks",
          position: "left",
        },
        { to: "/docs/cli/installation", label: "CLI", position: "left" },
        {
          href: repositoryUrl,
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            { label: "Migration guide", to: "/docs/migration/" },
            { label: "General SNS guide", href: "https://guide.sns.id/" },
          ],
        },
        {
          title: "Integrations",
          items: [
            {
              label: "JavaScript",
              to: "/docs/sdks/javascript/installation",
            },
            { label: "JS Kit", to: "/docs/sdks/js-kit/installation" },
            { label: "Rust", to: "/docs/sdks/rust/installation" },
            {
              label: "React Hooks",
              to: "/docs/react-hooks/installation",
            },
            { label: "CLI", to: "/docs/cli/installation" },
            { label: "SDK Proxy", to: "/docs/sdk-proxy/quickstart" },
          ],
        },
        {
          title: "Project",
          items: [
            { label: "SNS", href: "https://www.sns.id/" },
            {
              label: "Source",
              href: repositoryUrl,
            },
            {
              label: "MIT License",
              href: `${repositoryUrl}/blob/${sourceRevision}/LICENSE`,
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} SNS`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "bash",
        "http",
        "json",
        "rust",
        "tsx",
        "typescript",
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
