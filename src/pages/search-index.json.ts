import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ui } from '@/i18n/ui';

interface SearchRecord {
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  url: string;
  lang: string;
  category: 'project' | 'blog' | 'page';
}

/** Turn markdown/HTML into plain searchable text. */
function toPlainText(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/<[^>]+>/g, ' ') // html tags
    .replace(/[#>*_~`|]/g, ' ') // leftover markdown syntax
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async () => {
  const records: SearchRecord[] = [];

  // Projects (both languages)
  const projects = await getCollection('projects');
  for (const project of projects) {
    const lang = project.id.split('/')[0];
    records.push({
      title: project.data.title,
      excerpt: project.data.description,
      body: `${project.data.description} ${(project.data.tags || []).join(' ')}`,
      tags: project.data.tags || [],
      url: `/${lang}/portfolio/`,
      lang,
      category: 'project',
    });
  }

  // Blog posts (English content, shared across the site)
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  for (const post of posts) {
    const [lang, ...slugParts] = post.slug.split('/');
    const slug = slugParts.join('/');
    records.push({
      title: post.data.title,
      excerpt: post.data.description,
      body: toPlainText(post.body).slice(0, 4000),
      tags: post.data.tags || [],
      url: `/blog/${slug}/`,
      lang,
      category: 'blog',
    });
  }

  // Static pages, per language, sourced from the i18n strings
  for (const lang of ['en', 'it'] as const) {
    const t = ui[lang];
    records.push({
      title: t['nav.portfolio'],
      excerpt: toPlainText(t['about.p1']),
      body: toPlainText(
        [t['about.p1'], t['about.p2'], t['about.p3'], t['skills.title'], 'Python Java SQL Bash Linux Windows'].join(' ')
      ),
      tags: ['about', 'skills'],
      url: `/${lang}/portfolio/`,
      lang,
      category: 'page',
    });
    records.push({
      title: t['nav.privacy'],
      excerpt: t['privacy.subtitle'],
      body: toPlainText(`${t['privacy.title']} ${t['privacy.subtitle']}`),
      tags: ['privacy', 'security'],
      url: `/${lang}/privacy-security/`,
      lang,
      category: 'page',
    });
  }

  return new Response(JSON.stringify(records), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
