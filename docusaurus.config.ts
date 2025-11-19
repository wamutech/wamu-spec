import path from 'node:path';

import type { Config } from '@docusaurus/types';

import { themes } from 'prism-react-renderer';
import katex from 'rehype-katex';
import math from 'remark-math';
import citation from 'rehype-citation';

import remarkPandocPapers from './plugins/remark-pandoc-papers';
import rehypePandocPapers from './plugins/rehype-pandoc-papers';

let papersDir = path.join(process.cwd(), 'papers');
let remarkPlugins = [math, remarkPandocPapers];
let rehypePlugins = [
  katex,
  [
    citation,
    {
      bibliography: path.join(papersDir, 'references.bib'),
      csl: path.join(papersDir, 'modified-acm-long-author-list.csl'),
      linkCitations: true,
    },
  ],
  rehypePandocPapers,
];

const config: Config = {
  title: 'Wamu',
  tagline: 'A protocol and library for computation of threshold signatures by multiple cryptographic identities.',
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

  // Internalization.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Markdown
  markdown: {
    // Make "normal/commonmark" markdown parsing work for .md files.
    // https://docusaurus.io/docs/markdown-features/react#markdown-and-jsx-interoperability
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins,
          rehypePlugins,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          remarkPlugins,
          rehypePlugins,
        },
        theme: {
          customCss: require.resolve('./src/css/wamu.css'),
        },
      },
    ],
  ],

  themeConfig: {
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
          title: 'Resources',
          items: [
            {
              label: 'Whitepaper',
              to: '/whitepaper',
            },
            {
              label: 'Technical Specification',
              to: '/specification',
            },
            {
              label: 'Rust Implementation',
              href: 'https://github.com/wamutech/wamu-rs',
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
              label: 'X/Twitter',
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
      copyright: `<div class="footer-license-info">
            <div>Copyright © ${new Date().getFullYear()} <a href="https://davidsemakula.com" target="_blank" class="footer__link-item">David Semakula</a>.</div>
            <div>
              <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/" class="footer__link-item">
                <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/80x15.png" />
              </a>
            </div>
            <div>
              The <a href="/whitepaper" class="footer__link-item">whitepaper</a>, <a href="/specification" class="footer__link-item">technical specification</a> and website content are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/" target="_blank" class="footer__link-item">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
            </div>
          </div>`,
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  },

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};

export default config;
