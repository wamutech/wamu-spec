import type { Root, RootContent } from 'hast';
import type { VFile } from 'vfile';

import { fromHtml } from 'hast-util-from-html';
import { readingTime } from 'hast-util-reading-time';
import { selectAll } from 'hast-util-select';
import { removePosition } from 'unist-util-remove-position';
import { visit } from 'unist-util-visit';

// Converts an html string to a hast element.
function hastElementFromHtml(html: string): RootContent {
  // Convert html markup to hast and read the first child.
  return removePosition(fromHtml(html, { fragment: true }), { force: true }).children[0];
}

// Adds subtitle to the document if defined for papers.
function addSubtitle(ast: Root, file: VFile) {
  // Add subtitle to the beginning of the doc if it's a paper with a defined subtitle.
  const subtitle = file.data.matter?.paper?.subtitle;
  if (subtitle) {
    const markup = `<h2 style="color: var(--ifm-link-color);">${subtitle}</h2>`;

    // Convert html markup to hast.
    let hast = hastElementFromHtml(markup);

    // Insert author hast at the beginning of the tree.
    ast.children.unshift(hast);
  }
}

// Adds date (if defined) and reading time to the document for papers.
function addDateAndReadingTime(ast, file) {
  // Add date (if defined) and reading time info to the beginning of the doc if it's a paper.
  const matter = file.data.matter;
  if (matter?.paper) {
    const date = matter?.date;
    const markup = `<div class="margin-vert--md">
        ${[
          date ? `<time>${date.replaceAll('\\', '|')}</time>` : '',
          `${Math.ceil(readingTime(ast, { age: 18 }))} min read`,
        ]
          .filter(Boolean)
          .join(' · ')}
    </div>`;

    // Convert html markup to hast.
    let hast = hastElementFromHtml(markup);

    // Insert hast at the beginning of the tree.
    ast.children.unshift(hast);
  }
}

// Adds author to the document if defined for papers.
function addAuthor(ast: Root, file: VFile) {
  // Add authors widget to the beginning of the doc if it's a paper with defined authors.
  const authors = file.data.matter?.paper?.authors;
  if (authors && authors?.length > 0) {
    // TODO: Add support for multiple authors and leverage MDX components.
    const author = authors[0];
    const markup = `<div class="avatar margin-bottom--sm">
        <a href="${author.url}" target="_blank" rel="noopener noreferrer" class="avatar__photo-link">
            <img class="avatar__photo" src="${author.image_url}" alt="${author.name}">
        </a>
        <div class="avatar__intro" itemprop="author" itemscope="" itemtype="https://schema.org/Person">
            <div class="avatar__name">
                <a href="${author.url}" target="_blank" rel="noopener noreferrer" itemprop="url">
                    <span itemprop="name">${author.name}</span>
                </a>
            </div>
        </div>
    </div>`;

    // Convert html markup to hast.
    let authorHast = hastElementFromHtml(markup);

    // Insert hast at the beginning of the tree.
    ast.children.unshift(authorHast);
  }
}

// Adds pdf hyperlink to the document if defined for papers.
function addPdfLink(ast: Root, file: VFile) {
  // Add hyperlink at the beginning of the doc if it's a paper with a defined pdf.
  const pdfFilename = file.data.matter?.paper?.pdf;
  if (pdfFilename) {
    const markup = `<a href="/${pdfFilename}" target="_blank" rel="noopener noreferrer">
        View as PDF
    </a>`;

    // Convert html markup to hast.
    let hast = hastElementFromHtml(markup);

    // Insert hast at the beginning of the tree.
    ast.children.unshift(hast);
  }
}

// Converts URL literals in references into hyperlinks.
// Should be placed after rehype-citation (or equivalent).
function autoLinkReferences(ast: Root) {
  // Get all refs.
  let refs = selectAll('#refs.references.csl-bib-body .csl-right-inline', ast);
  for (let ref of refs) {
    // Get all text nodes for each ref.
    visit(ref, 'text', (node, _, parent) => {
      // The text of the node.
      const text = node.value;
      // Ignore empty nodes as well as text nodes that are already wrapped in a hyperlink.
      if (text && parent.tagName !== 'a') {
        // We expect at most one url in references, so no need to look for more than one.
        const urlRegex = /\bhttps?:\/\/.*\b/;
        const match = urlRegex.exec(text);

        // On process if not contains a URL.
        if (match) {
          // Extract url.
          const url = match[0];

          // Extract prefix and suffix.
          const startIdx = match.index;
          const endIdx = startIdx + url.length;
          const prefix = text.slice(0, startIdx);
          const suffix = text.slice(endIdx);

          let children = [];
          // Add prefix to children.
          if (prefix.length > 0) {
            children.push({
              type: 'text',
              value: prefix,
            });
          }

          // Add hyperlink to children.
          children.push({
            type: 'element',
            tagName: 'a',
            properties: {
              href: url,
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            children: [
              {
                type: 'text',
                value: url,
              },
            ],
          });

          // Add suffix to children.
          if (suffix.length > 0) {
            children.push({
              type: 'text',
              value: suffix,
            });
          }

          // Replace text node.
          node.type = 'element';
          node.tagName = 'span';
          node.children = children;
          delete node.value;
        }
      }
    });
  }
}

// Rehype customizations for pandoc papers.
export default function rehypePandocPapers() {
  return async (ast: Root, file: VFile) => {
    // Convert URL literals in references into hyperlinks.
    autoLinkReferences(ast);
    // Order of execution matters for these because they insert at the top of the document.
    // Add pdf hyperlink to the document for papers.
    addPdfLink(ast, file);
    // Add author to the document for papers.
    addAuthor(ast, file);
    // Add date (if defined) and reading time to the document for papers.
    addDateAndReadingTime(ast, file);
    // Adds subtitle to the document if defined for papers.
    addSubtitle(ast, file);
  };
}
