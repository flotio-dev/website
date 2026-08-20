import fs from 'fs';
import path from 'path';

export interface DocMetadata {
  title: string;
  description: string;
  category: string;
  order: number;
  badge?: string;
  slug: string;
  updatedAt?: string;
  readTime?: string;
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface DocArticle extends DocMetadata {
  contentHtml: string;
  toc: TOCItem[];
  prevDoc?: { title: string; slug: string } | null;
  nextDoc?: { title: string; slug: string } | null;
}

const docsDirectory = path.join(process.cwd(), 'content', 'docs');

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseFrontmatter(fileContent: string): { data: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match) {
    return { data: {}, content: fileContent };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, any> = {};

  const lines = yamlBlock.split(/\r?\n/);
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      } else if (!isNaN(Number(value)) && value !== '') {
        data[key] = Number(value);
        continue;
      } else if (value.toLowerCase() === 'true') {
        data[key] = true;
        continue;
      } else if (value.toLowerCase() === 'false') {
        data[key] = false;
        continue;
      }

      data[key] = value;
    }
  }

  return { data, content };
}

function parseMarkdownToHtml(markdown: string): { html: string; toc: TOCItem[] } {
  const toc: TOCItem[] = [];
  const lines = markdown.split(/\r?\n/);
  const processedLines: string[] = [];

  let inCodeBlock = false;
  let codeLang = '';
  let codeBuffer: string[] = [];

  let inList = false;
  let inOrderedList = false;
  let inTable = false;
  let tableBuffer: string[] = [];

  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const formatInline = (text: string): string => {
    let res = text;
    res = res.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    res = res.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 600;">$1</strong>');
    res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
    res = res.replace(/`([^`]+)`/g, '<code style="background: rgba(255, 87, 34, 0.12); color: #ff5722; padding: 2px 6px; border-radius: 6px; font-size: 0.85em; font-family: ui-monospace, monospace; border: 1px solid rgba(255, 87, 34, 0.25);">$1</code>');
    res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #ff5722; font-weight: 500; text-decoration: underline; text-underline-offset: 3px;">$1</a>');
    return res;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block detection
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim() || 'bash';
        codeBuffer = [];
        continue;
      } else {
        inCodeBlock = false;
        const codeContent = escapeHtml(codeBuffer.join('\n'));
        processedLines.push(
          `<div style="margin: 24px 0; border-radius: 12px; border: 1px solid var(--border-subtle); overflow: hidden; background: var(--bg-surface-elevated); box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid var(--border-subtle); background: var(--bg-surface);">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                <span style="margin-left: 10px; font-size: 11px; font-weight: 700; color: #ff5722; text-transform: uppercase; font-family: ui-monospace, monospace; letter-spacing: 0.05em;">${codeLang}</span>
              </div>
              <button onclick="navigator.clipboard.writeText(this.closest('div').nextElementSibling.querySelector('code').innerText); this.innerText='Copied!'; setTimeout(() => this.innerText='Copy', 2000)" style="padding: 3px 10px; border-radius: 6px; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); color: var(--text-secondary); font-size: 11px; cursor: pointer; font-weight: 500; transition: all 0.2s;">Copy</button>
            </div>
            <pre style="margin: 0; padding: 16px; overflow-x: auto; font-family: ui-monospace, monospace; font-size: 13.5px; line-height: 1.65; color: var(--text-primary);"><code style="font-family: inherit;">${codeContent}</code></pre>
          </div>`
        );
        continue;
      }
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Callouts
    if (line.trim().startsWith('> [!')) {
      const alertTypeMatch = line.trim().match(/>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/i);
      const alertType = alertTypeMatch ? alertTypeMatch[1].toUpperCase() : 'NOTE';
      
      const alertContentLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('>')) {
        alertContentLines.push(lines[j].trim().replace(/^>\s?/, ''));
        j++;
      }
      i = j - 1;

      const alertBody = formatInline(alertContentLines.join(' '));
      const colorsMap: Record<string, { border: string; bg: string; text: string; icon: string; label: string }> = {
        NOTE: { border: 'rgba(56, 189, 248, 0.4)', bg: 'rgba(56, 189, 248, 0.08)', text: '#38bdf8', icon: 'ℹ️', label: 'Note' },
        TIP: { border: 'rgba(34, 197, 94, 0.4)', bg: 'rgba(34, 197, 94, 0.08)', text: '#22c55e', icon: '💡', label: 'Pro Tip' },
        WARNING: { border: 'rgba(245, 158, 11, 0.4)', bg: 'rgba(245, 158, 11, 0.08)', text: '#f59e0b', icon: '⚠️', label: 'Warning' },
        IMPORTANT: { border: 'rgba(255, 87, 34, 0.4)', bg: 'rgba(255, 87, 34, 0.08)', text: '#ff5722', icon: '📌', label: 'Important' },
      };

      const themeChoice = colorsMap[alertType] || colorsMap.NOTE;

      processedLines.push(
        `<div style="margin: 20px 0; padding: 16px 20px; border-radius: 12px; border-left: 4px solid ${themeChoice.text}; border: 1px solid ${themeChoice.border}; border-left-width: 4px; background: ${themeChoice.bg};">
          <div style="font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: ${themeChoice.text}; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <span>${themeChoice.icon}</span> <span>${themeChoice.label}</span>
          </div>
          <div style="font-size: 14px; line-height: 1.6; color: var(--text-primary);">${alertBody}</div>
        </div>`
      );
      continue;
    }

    if (line.trim().startsWith('>')) {
      const quoteText = formatInline(line.trim().replace(/^>\s?/, ''));
      processedLines.push(`<blockquote style="border-left: 3px solid #ff5722; padding-left: 16px; margin: 16px 0; font-style: italic; color: var(--text-secondary);">${quoteText}</blockquote>`);
      continue;
    }

    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      const title = h1Match[1].trim();
      const id = slugify(title);
      processedLines.push(`<h1 id="${id}" style="font-size: 2rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; margin-top: 32px; margin-bottom: 16px;">${formatInline(title)}</h1>`);
      continue;
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      const title = h2Match[1].trim();
      const id = slugify(title);
      toc.push({ id, text: title, level: 2 });
      processedLines.push(`<h2 id="${id}" style="font-size: 1.5rem; font-weight: 600; color: var(--text-primary); letter-spacing: -0.02em; margin-top: 40px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle);">${formatInline(title)}</h2>`);
      continue;
    }

    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      const title = h3Match[1].trim();
      const id = slugify(title);
      toc.push({ id, text: title, level: 3 });
      processedLines.push(`<h3 id="${id}" style="font-size: 1.2rem; font-weight: 600; color: var(--text-primary); letter-spacing: -0.01em; margin-top: 28px; margin-bottom: 12px;">${formatInline(title)}</h3>`);
      continue;
    }

    const h4Match = line.match(/^####\s+(.+)$/);
    if (h4Match) {
      const title = h4Match[1].trim();
      const id = slugify(title);
      processedLines.push(`<h4 id="${id}" style="font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-top: 20px; margin-bottom: 8px;">${formatInline(title)}</h4>`);
      continue;
    }

    if (line.trim() === '---' || line.trim() === '***') {
      processedLines.push('<hr style="margin: 32px 0; border: 0; border-top: 1px solid var(--border-subtle);" />');
      continue;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableBuffer = [];
      }
      tableBuffer.push(line.trim());

      if (i + 1 >= lines.length || !lines[i + 1].trim().startsWith('|')) {
        inTable = false;
        if (tableBuffer.length >= 2) {
          const headerCols = tableBuffer[0].split('|').slice(1, -1).map(c => formatInline(c.trim()));
          const bodyRows = tableBuffer.slice(2);

          let tableHtml = '<div style="overflow-x: auto; margin: 24px 0; border-radius: 12px; border: 1px solid var(--border-subtle);"><table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 13.5px;">';
          tableHtml += '<thead style="background: var(--bg-surface-elevated); border-bottom: 1px solid var(--border-subtle);"><tr>';
          for (const col of headerCols) {
            tableHtml += `<th style="padding: 12px 16px; font-weight: 600; color: var(--text-primary);">${col}</th>`;
          }
          tableHtml += '</tr></thead><tbody>';
          for (let r = 0; r < bodyRows.length; r++) {
            const row = bodyRows[r];
            const cols = row.split('|').slice(1, -1).map(c => formatInline(c.trim()));
            const rowBg = r % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)';
            tableHtml += `<tr style="background: ${rowBg}; border-bottom: 1px solid var(--border-subtle);">`;
            for (const col of cols) {
              tableHtml += `<td style="padding: 12px 16px; color: var(--text-secondary);">${col}</td>`;
            }
            tableHtml += '</tr>';
          }
          tableHtml += '</tbody></table></div>';
          processedLines.push(tableHtml);
        }
      }
      continue;
    }

    // Lists
    const listMatch = line.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      if (!inList) {
        inList = true;
        processedLines.push('<ul style="margin: 12px 0; padding-left: 24px; color: var(--text-secondary); line-height: 1.7; list-style-type: disc;">');
      }
      processedLines.push(`<li style="margin-bottom: 6px;"><span style="color: var(--text-primary);">${formatInline(listMatch[1])}</span></li>`);
      if (i + 1 >= lines.length || (!lines[i + 1].trim().startsWith('- ') && !lines[i + 1].trim().startsWith('* '))) {
        inList = false;
        processedLines.push('</ul>');
      }
      continue;
    }

    const oListMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (oListMatch) {
      if (!inOrderedList) {
        inOrderedList = true;
        processedLines.push('<ol style="margin: 12px 0; padding-left: 24px; color: var(--text-secondary); line-height: 1.7; list-style-type: decimal;">');
      }
      processedLines.push(`<li style="margin-bottom: 6px;"><span style="color: var(--text-primary);">${formatInline(oListMatch[2])}</span></li>`);
      if (i + 1 >= lines.length || !lines[i + 1].trim().match(/^\d+\.\s+/)) {
        inOrderedList = false;
        processedLines.push('</ol>');
      }
      continue;
    }

    if (line.trim() === '') {
      continue;
    }

    processedLines.push(`<p style="margin: 14px 0; font-size: 15px; line-height: 1.75; color: var(--text-secondary);">${formatInline(line)}</p>`);
  }

  return {
    html: processedLines.join('\n'),
    toc,
  };
}

export function getAllDocs(): DocMetadata[] {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(docsDirectory);
  const docs: DocMetadata[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;

    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(docsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = parseFrontmatter(fileContents);

    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.ceil(wordCount / 200)} min read`;

    docs.push({
      title: data.title || slug,
      description: data.description || '',
      category: data.category || 'General',
      order: typeof data.order === 'number' ? data.order : 99,
      badge: data.badge || undefined,
      slug,
      updatedAt: data.updatedAt || 'August 2026',
      readTime,
    });
  }

  return docs.sort((a, b) => a.order - b.order);
}

export function getDocBySlug(slug: string): DocArticle | null {
  const fullPath = path.join(docsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = parseFrontmatter(fileContents);
  const { html, toc } = parseMarkdownToHtml(content);

  const allDocs = getAllDocs();
  const currentIndex = allDocs.findIndex(d => d.slug === slug);

  const prevDoc = currentIndex > 0 ? { title: allDocs[currentIndex - 1].title, slug: allDocs[currentIndex - 1].slug } : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? { title: allDocs[currentIndex + 1].title, slug: allDocs[currentIndex + 1].slug } : null;

  const wordCount = content.split(/\s+/).length;
  const readTime = `${Math.ceil(wordCount / 200)} min read`;

  return {
    title: data.title || slug,
    description: data.description || '',
    category: data.category || 'General',
    order: typeof data.order === 'number' ? data.order : 99,
    badge: data.badge || undefined,
    slug,
    updatedAt: data.updatedAt || 'August 2026',
    readTime,
    contentHtml: html,
    toc,
    prevDoc,
    nextDoc,
  };
}
