import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./index.module.css";

type Integration = {
  title: string;
  version: string;
  description: string;
  to: string;
  accent: string;
};

const integrations: Integration[] = [
  {
    title: "JavaScript",
    version: "v4",
    description:
      "The web3.js SDK for resolution, ownership, records, and domain lifecycle.",
    to: "/docs/sdks/javascript/installation",
    accent: "lime",
  },
  {
    title: "JS Kit",
    version: "v1",
    description:
      "A modern SNS SDK built on @solana/kit, with codecs and composable instruction builders.",
    to: "/docs/sdks/js-kit/installation",
    accent: "mint",
  },
  {
    title: "Rust",
    version: "v2",
    description:
      "Async and blocking clients, derivation helpers, models, and instruction builders.",
    to: "/docs/sdks/rust/installation",
    accent: "amber",
  },
  {
    title: "React Hooks",
    version: "v4",
    description:
      "Typed TanStack Query hooks for SNS data in React applications.",
    to: "/docs/react-hooks/installation",
    accent: "violet",
  },
  {
    title: "CLI",
    version: "v3",
    description:
      "Resolve, inspect, register, transfer, and administer SNS from a terminal.",
    to: "/docs/cli/installation",
    accent: "blue",
  },
  {
    title: "SDK Proxy",
    version: "Experimental",
    description:
      "An HTTP facade for environments that cannot consume a native SDK.",
    to: "/docs/sdk-proxy/quickstart",
    accent: "rose",
  },
];

function IntegrationCard({
  integration,
}: {
  integration: Integration;
}): ReactNode {
  return (
    <Link
      className={clsx(styles.integrationCard, styles[integration.accent])}
      to={integration.to}
    >
      <span className={styles.cardVersion}>{integration.version}</span>
      <h3>{integration.title}</h3>
      <p>{integration.description}</p>
      <span className={styles.cardAction}>View docs →</span>
    </Link>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="SDKs, tools, and migration guides"
      description="Developer documentation for Solana Name Service SDKs, React hooks, CLI, Proxy, and migration."
    >
      <main>
        <header className={styles.hero}>
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <img src="/img/logo.svg" alt="" />
              <span>Solana Name Service</span>
            </div>
            <h1>
              Build with domains,
              <br />
              not addresses.
            </h1>
            <p className={styles.heroLead}>
              One reference for SNS resolution, records, ownership,
              transactions, command-line workflows.
            </p>
            <div className={styles.heroActions}>
              <Link
                className="button button--primary button--lg"
                to="/docs/sdks/javascript/installation"
              >
                Start building
              </Link>
              <Link className={styles.secondaryAction} to="/docs/migration/">
                Read the migration guide
              </Link>
            </div>
          </div>
          <aside className={styles.migrationPanel}>
            <span className={styles.panelLabel}>Migration</span>
            <strong>Enabling .sns</strong>
            <p>
              Upgrade to the latest SDK versions and enable `.sns` resolution.
            </p>
            <Link to="/docs/migration/">Start the migration →</Link>
          </aside>
        </header>

        <section className={styles.integrations}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionIndex}>01 / INTEGRATIONS</span>
              <h2>Choose your interface</h2>
            </div>
            <p>
              Start with the integration that matches your runtime. Each guide
              documents its exact domain inputs, result shapes, and transaction
              responsibilities.
            </p>
          </div>
          <div className={styles.integrationGrid}>
            {integrations.map((integration) => (
              <IntegrationCard
                integration={integration}
                key={integration.title}
              />
            ))}
          </div>
        </section>

        <section className={styles.rules}>
          <span className={styles.sectionIndex}>02 / INPUTS &amp; DISPLAY</span>
          <div className={styles.ruleGrid}>
            <div>
              <code>domain.sns</code>
              <h2>Full domains for resolution</h2>
              <p>
                Use complete, suffixed domains with high-level resolution APIs.
              </p>
            </div>
            <div>
              <code>domain</code>
              <h2>Trimmed domain for derivation</h2>
              <p>
                Low-level address derivation accepts explicit TLD-less domains.
              </p>
            </div>
            <div>
              <code>.sns</code>
              <h2>Display with .sns</h2>
              <p>
                Render existing SNS domains with the .sns suffix, and update
                images for tokenized domains.
              </p>
            </div>
          </div>
          <Link className={styles.rulesLink} to="/docs/migration/">
            Review the migration guide →
          </Link>
        </section>
      </main>
    </Layout>
  );
}
