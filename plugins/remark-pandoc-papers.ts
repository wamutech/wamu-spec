import fs from 'node:fs';

import type { Root } from 'mdast';
import type { VFile } from 'vfile';

import { DEFAULT_PARSE_FRONT_MATTER } from '@docusaurus/utils';
import { visit } from 'unist-util-visit';

// Adds YAML frontmatter to vfile data.
// Docusaurus strips frontmatter from the markdown content before it passes it to mdx,
// so we can't just use a remark plugin (e.g. https://github.com/remarkjs/remark-frontmatter) in docusaurus config
// to achieve this as it won't have access to the YAML frontmatter.
// https://github.com/facebook/docusaurus/blob/docusaurus-v2/packages/docusaurus-mdx-loader/src/loader.ts#L155-L220
async function extractFrontmatter(file: VFile) {
  // Parse frontmatter from the original file contents.
  // https://github.com/vfile/vfile#filepath
  const fileContent = fs.readFileSync(file.path, 'utf8');
  // https://github.com/facebook/docusaurus/blob/docusaurus-v2/packages/docusaurus-mdx-loader/src/loader.ts#L163
  const { frontMatter } = await DEFAULT_PARSE_FRONT_MATTER({ fileContent, filePath: file.path });

  // Add frontmatter to vfile data.
  file.data.matter = frontMatter;
}

// Replaces the pandoc refs directive with a rehype-citation `[^ref]` placeholder.
// https://pandoc.org/MANUAL.html#placement-of-the-bibliography
// https://github.com/timlrx/rehype-citation/blob/v1.0.1/README.md?plain=1#L132
// https://github.com/timlrx/rehype-citation/blob/v1.0.1/src/types.js#L13-L14
function convertPandocToRehypeCitationRef(ast: Root) {
  visit(ast, 'text', (node) => {
    if (/:::\s*{#refs}\s*:::/i.test(node.value)) {
      node.value = '[^ref]';
    }
  });
}

// Remark customizations for pandoc papers.
export default function remarkPapers() {
  return async (ast: Root, file: VFile) => {
    // Add YAML frontmatter to vfile data.
    await extractFrontmatter(file);
    // Replace pandoc refs placeholder with rehype-citation ref placeholder.
    convertPandocToRehypeCitationRef(ast);
  };
}
