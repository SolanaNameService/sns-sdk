import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import MDXComponents from "@theme-original/MDXComponents";
import SourceLink from "../components/SourceLink";

function CutoffSlot() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <>{Number(siteConfig.customFields.cutoffSlot).toLocaleString("en-US")}</>
  );
}

export default {
  ...MDXComponents,
  CutoffSlot,
  SourceLink,
};
