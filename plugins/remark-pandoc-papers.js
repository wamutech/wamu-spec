const fs = require('fs');
const { DEFAULT_PARSE_FRONT_MATTER } = require('@docusaurus/utils');

// Adds YAML frontmatter to vfile data.
// Docusaurus strips frontmatter from the markdown content before it passes it to mdx,
// so we can't just use a remark plugin (e.g. https://github.com/remarkjs/remark-frontmatter) in docusaurus config
// to achieve this as it won't have access to the YAML frontmatter.
// https://github.com/facebook/docusaurus/blob/docusaurus-v2/packages/docusaurus-mdx-loader/src/loader.ts#L155-L220
async function extractFrontmatter(_, file) {
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
async function convertPandocToRehypeCitationRef(ast, _) {
  const { visit } = await import('unist-util-visit');
  visit(ast, 'text', (node) => {
    if (/:::\s*{#refs}\s*:::/i.test(node.value)) {
      node.value = '[^ref]';
    }
  });
}

// Remark customizations for pandoc papers.
function remarkPapers() {
  return async (ast, file) => {
    await Promise.all([
      // Add YAML frontmatter to vfile data.
      extractFrontmatter(ast, file),
      // Replace pandoc refs placeholder with rehype-citation ref placeholder.
      convertPandocToRehypeCitationRef(ast, file),
    ]);
  };
}

module.exports = remarkPapers;
