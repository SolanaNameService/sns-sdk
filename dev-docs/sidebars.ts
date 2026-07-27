import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: "category",
      label: "Migration Guide",
      items: [
        {
          type: "doc",
          id: "migration/index",
          label: "Overview",
        },
        {
          type: "doc",
          id: "migration/javascript",
          label: "JavaScript",
        },
        {
          type: "doc",
          id: "migration/js-kit",
          label: "JS Kit",
        },
        {
          type: "doc",
          id: "migration/rust",
          label: "Rust",
        },
      ],
    },
    {
      type: "category",
      label: "SDKs",
      items: [
        {
          type: "category",
          label: "JavaScript",
          items: [
            {
              type: "doc",
              id: "sdks/javascript/installation",
              label: "Installation",
            },
            {
              type: "doc",
              id: "sdks/javascript/quickstart",
              label: "Quickstart",
            },
            {
              type: "doc",
              id: "sdks/javascript/api/index",
              label: "API Reference",
            },
          ],
        },
        {
          type: "category",
          label: "JS Kit",
          items: [
            {
              type: "doc",
              id: "sdks/js-kit/installation",
              label: "Installation",
            },
            {
              type: "doc",
              id: "sdks/js-kit/quickstart",
              label: "Quickstart",
            },
            {
              type: "doc",
              id: "sdks/js-kit/api/index",
              label: "API Reference",
            },
          ],
        },
        {
          type: "category",
          label: "Rust",
          items: [
            {
              type: "doc",
              id: "sdks/rust/installation",
              label: "Installation",
            },
            {
              type: "doc",
              id: "sdks/rust/quickstart",
              label: "Quickstart",
            },
            {
              type: "doc",
              id: "sdks/rust/api/index",
              label: "API Reference",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "SDK Proxy",
      items: [
        {
          type: "doc",
          id: "sdk-proxy/quickstart",
          label: "Quickstart",
        },
        {
          type: "category",
          label: "Endpoints",
          items: [
            {
              type: "category",
              label: "General",
              items: [
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/general/root",
                  label: "GET /",
                },
              ],
            },
            {
              type: "category",
              label: "Resolution",
              items: [
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/resolution/resolve",
                  label: "GET /resolve/:domain",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/resolution/safe-resolve",
                  label: "GET /safe-resolve/:domain",
                },
              ],
            },
            {
              type: "category",
              label: "Domains and ownership",
              items: [
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/domains/domain-key",
                  label: "GET /domain-key/:domain",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/domains/domains",
                  label: "GET /domains/:owner",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/domains/primary-domain",
                  label: "GET /primary-domain/:owner",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/domains/favorite-domain",
                  label: "GET /favorite-domain/:owner",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/domains/multiple-primary-domains",
                  label: "GET /multiple-primary-domains/:owners",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/domains/multiple-favorite-domains",
                  label: "GET /multiple-favorite-domains/:owners",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/domains/reverse-key",
                  label: "GET /reverse-key/:domain",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/domains/reverse-lookup",
                  label: "GET /reverse-lookup/:pubkey",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/domains/subdomains",
                  label: "GET /subdomains/:parent",
                },
              ],
            },
            {
              type: "category",
              label: "Records",
              items: [
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/records/types-record",
                  label: "GET /types/record",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/records/record-key-v2",
                  label: "GET /record-key-v2/:domain/:record",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/records/record-v2",
                  label: "GET /record-v2/:domain/:record",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/records/records-v2",
                  label: "GET /records-v2/:domain",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/records/record-key",
                  label: "GET /record-key/:domain/:record",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/records/record",
                  label: "GET /record/:domain/:record",
                },
              ],
            },
            {
              type: "category",
              label: "Instructions",
              items: [
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/instructions/register",
                  label: "GET /register",
                },
                {
                  type: "doc",
                  id: "sdk-proxy/endpoints/instructions/create-subdomain",
                  label: "GET /create-subdomain",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "React Hooks",
      items: [
        {
          type: "doc",
          id: "react-hooks/installation",
          label: "Installation",
        },
        {
          type: "doc",
          id: "react-hooks/quickstart",
          label: "Quickstart",
        },
        {
          type: "doc",
          id: "react-hooks/api/index",
          label: "API Reference",
        },
      ],
    },
    {
      type: "category",
      label: "CLI",
      items: [
        {
          type: "doc",
          id: "cli/installation",
          label: "Installation",
        },
        {
          type: "doc",
          id: "cli/quickstart",
          label: "Quickstart",
        },
        {
          type: "category",
          label: "Commands",
          items: [
            {
              type: "doc",
              id: "cli/commands/burn",
              label: "burn",
            },
            {
              type: "doc",
              id: "cli/commands/domains",
              label: "domains",
            },
            {
              type: "doc",
              id: "cli/commands/sub-registrar",
              label: "sub-registrar",
            },
            {
              type: "doc",
              id: "cli/commands/lookup",
              label: "lookup",
            },
            {
              type: "doc",
              id: "cli/commands/record-v2",
              label: "record-v2",
            },
            {
              type: "doc",
              id: "cli/commands/register",
              label: "register",
            },
            {
              type: "doc",
              id: "cli/commands/resolve",
              label: "resolve",
            },
            {
              type: "doc",
              id: "cli/commands/reverse-lookup",
              label: "reverse-lookup",
            },
            {
              type: "doc",
              id: "cli/commands/primary-domain",
              label: "primary-domain",
            },
            {
              type: "doc",
              id: "cli/commands/transfer",
              label: "transfer",
            },
          ],
        },
      ],
    },
  ],
};

export default sidebars;
