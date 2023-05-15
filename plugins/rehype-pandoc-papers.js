// Converts an html string to a hast element.
async function hastElementFromHtml(html) {
  const { fromHtml } = await import('hast-util-from-html');
  const { removePosition } = await import('unist-util-remove-position');
  // Convert html markup to hast and read the first child.
  return removePosition(fromHtml(html, { fragment: true }), { force: true }).children[0];
}

// Adds subtitle to the document if defined for papers.
async function addSubtitle(ast, file) {
  // Add subtitle to the beginning of the doc if it's a paper with a defined subtitle.
  const subtitle = file.data.matter?.paper?.subtitle;
  if (subtitle) {
    const markup = `<h2 style="color: var(--ifm-link-color);">${subtitle}</h2>`;

    // Convert html markup to hast.
    let hast = await hastElementFromHtml(markup);

    // Insert author hast at the beginning of the tree.
    ast.children.unshift(hast);
  }
}

// Adds date (if defined) and reading time to the document for papers.
async function addDateAndReadingTime(ast, file) {
  // Add date (if defined) and reading time info to the beginning of the doc if it's a paper.
  const matter = file.data.matter;
  if (matter?.paper) {
    const { readingTime } = await import('hast-util-reading-time');
    const date = matter?.date;
    const markup = `<div class="margin-vert--md">
        ${[date ? `<time>${date}</time>` : '', `${Math.ceil(readingTime(ast, { age: 18 }))} min read`]
          .filter(Boolean)
          .join(' · ')}
    </div>`;

    // Convert html markup to hast.
    let hast = await hastElementFromHtml(markup);

    // Insert hast at the beginning of the tree.
    ast.children.unshift(hast);
  }
}

// Adds author to the document if defined for papers.
async function addAuthor(ast, file) {
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
    let authorHast = await hastElementFromHtml(markup);

    // Insert hast at the beginning of the tree.
    ast.children.unshift(authorHast);
  }
}

// Adds pdf hyperlink to the document if defined for papers.
async function addPdfLink(ast, file) {
  // Add hyperlink at the beginning of the doc if it's a paper with a defined pdf.
  const pdfFilename = file.data.matter?.paper?.pdf;
  if (pdfFilename) {
    const markup = `<a href="/${pdfFilename}" target="_blank" rel="noopener noreferrer">
        View as PDF
    </a>`;

    // Convert html markup to hast.
    let hast = await hastElementFromHtml(markup);

    // Insert hast at the beginning of the tree.
    ast.children.unshift(hast);
  }
}

// Converts URL literals in references into hyperlinks.
// Should be placed after rehype-citation (or equivalent).
async function autoLinkReferences(ast) {
  const { selectAll } = await import('hast-util-select');
  const { visit } = await import('unist-util-visit');

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
          const markup = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
          children.push(hastElementFromHtml(markup));

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
function rehypePandocPapers() {
  return async (ast, file) => {
    await Promise.all([
      // Convert URL literals in references into hyperlinks.
      autoLinkReferences(ast, file),

      // Order of execution matters for these because they insert at the top of the document.
      (async () => {
        for (const callable of [
          // Add pdf hyperlink to the document for papers.
          addPdfLink,
          // Add author to the document for papers.
          addAuthor,
          // Add date (if defined) and reading time to the document for papers.
          addDateAndReadingTime,
          // Adds subtitle to the document if defined for papers.
          addSubtitle,
        ]) {
          await callable(ast, file);
        }
      })(),
    ]);
  };
}

module.exports = rehypePandocPapers;
