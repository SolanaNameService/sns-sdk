import OriginalDocSidebar from "@theme-original/DocSidebar";
import type { ComponentProps } from "react";

const apiLandingPaths = [
  "/docs/sdks/javascript/api/",
  "/docs/sdks/js-kit/api/",
  "/docs/sdks/rust/api/",
  "/docs/react-hooks/api/",
];

function activeSidebarPath(path: string) {
  return (
    apiLandingPaths.find((landingPath) => path.startsWith(landingPath)) ?? path
  );
}

export default function DocSidebar(
  props: ComponentProps<typeof OriginalDocSidebar>,
) {
  return <OriginalDocSidebar {...props} path={activeSidebarPath(props.path)} />;
}
