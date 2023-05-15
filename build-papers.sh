#!/bin/bash

# Source directory for papers.
source_dir="papers"

# Create output directories if they don't exist.
for output_dir in papers/generated docs static; do
  if [ ! -d "$output_dir" ]; then
      mkdir -p "$output_dir"
  fi
done

# Convert papers to different formats.
for file in $source_dir/*.md; do
  [ -f "$file" ] || continue

  # Sources are in Pandoc's Markdown <https://pandoc.org/MANUAL.html#pandocs-markdown>.
  write_cmd_source="${file} -f markdown -s --toc --toc-depth 3 --citeproc --bibliography=${source_dir}/references.bib --csl=${source_dir}/modified-acm-long-author-list.csl --metadata link-citations=true"

  # Removes directory.
  output_filename="${file#${source_dir}/}"

  # Removes extension.
  output_filename="${output_filename%.md}"

  # Copy to GitHub flavored markdown to `/docs`.
  cp ${file} "docs/${output_filename}.md"

  # Converts to LaTeX and saves it in `/papers`.
  pandoc $write_cmd_source -o "papers/generated/${output_filename}.tex"

  # Converts to PDF and saves it in `/static`.
  pandoc $write_cmd_source -o "static/${output_filename}.pdf"
done
