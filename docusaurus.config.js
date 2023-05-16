// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const path = require('path');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const math = require('remark-math');

const remarkPandocPapers = require('./plugins/remark-pandoc-papers');
const rehypePandocPapers = require('./plugins/rehype-pandoc-papers');

// Async to support ESM only MDX plugins.
// https://docusaurus.io/docs/markdown-features/plugins#installing-plugins
// https://docusaurus.io/docs/markdown-features/math-equations#upgrading-rehype-katex-beyond-recommended-version
/** @type {() => Promise<import('@docusaurus/types').Config>} */
async function createConfig() {
  const katex = (await import('rehype-katex')).default;
  const rehypeCitation = (await import('rehype-citation')).default;

  const papersDir = path.join(process.cwd(), 'papers');
  const remarkPlugins = [math, remarkPandocPapers];
  const rehypePlugins = [
    katex,
    [
      rehypeCitation,
      {
        bibliography: path.join(papersDir, 'references.bib'),
        csl: path.join(papersDir, 'modified-acm-long-author-list.csl'),
        linkCitations: true,
      },
    ],
    rehypePandocPapers,
  ];

  return {
    title: 'Wamu',
    tagline:
      'A protocol and library for building threshold signature wallets controlled by multiple decentralized identities.',
    favicon: 'img/logo.svg',

    // Production URL.
    url: 'https://wamu.tech',
    baseUrl: '/',

    // GitHub pages deployment config.
    organizationName: 'wamutech',
    projectName: 'wamu-spec',
    deploymentBranch: 'master',
    trailingSlash: false,

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Internalization.
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },

    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            routeBasePath: '/',
            sidebarPath: require.resolve('./sidebars.js'),
            editUrl: 'https://github.com/wamutech/wamu-spec',
            remarkPlugins,
            rehypePlugins,
            showLastUpdateAuthor: true,
            showLastUpdateTime: true,
          },
          blog: {
            showReadingTime: true,
            editUrl: 'https://github.com/wamutech/wamu-spec',
            remarkPlugins,
            rehypePlugins,
          },
          theme: {
            customCss: require.resolve('./src/css/wamu.css'),
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        // social card.
        image: 'img/logo.svg',
        navbar: {
          title: 'Wamu',
          logo: {
            alt: 'Wamu',
            src: 'img/logo.svg',
          },
          items: [
            {
              to: '/whitepaper',
              label: 'Whitepaper',
              position: 'left',
            },
            {
              to: '/specification',
              label: 'Technical Specification',
              position: 'left',
            },
            {
              href: 'https://github.com/wamutech/',
              label: 'Roadmap',
              position: 'right',
            },
            {
              href: 'https://github.com/wamutech/',
              label: 'GitHub',
              position: 'right',
            },
          ],
        },
        footer: {
          style: 'dark',
          links: [
            {
              title: 'Docs',
              items: [
                {
                  label: 'Whitepaper',
                  to: '/whitepaper',
                },
                {
                  label: 'Technical Specification',
                  to: '/specification',
                },
              ],
            },
            {
              title: 'Community',
              items: [
                {
                  label: 'GitHub',
                  href: 'https://github.com/wamutech/',
                },
                {
                  label: 'Stack Overflow',
                  href: 'https://stackoverflow.com/questions/tagged/wamu',
                },
                {
                  label: 'Twitter',
                  href: 'https://twitter.com/davidsemakula',
                },
              ],
            },
            {
              title: 'More',
              items: [
                {
                  label: 'Roadmap',
                  href: 'https://github.com/wamutech/',
                },
              ],
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} <a href="https://davidsemakula.com" target="_blank">David Semakula</a>.`,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
        },
        tableOfContents: {
          minHeadingLevel: 2,
          maxHeadingLevel: 4,
        },
      }),

    stylesheets: [
      {
        href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
        type: 'text/css',
        integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
        crossorigin: 'anonymous',
      },
    ],
  };
}

module.exports = createConfig;
