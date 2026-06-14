import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    lottieIcon: z.string().optional(),
    span: z.enum(['1', '2', 'wide']).default('1'),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    links: z.object({
      demo: z.string().url().optional(),
      github: z.string().url().optional(),
      telegram: z.string().url().optional(),
      custom: z.object({
        label: z.string(),
        url: z.string().url(),
        icon: z.string().optional(),
      }).optional(),
    }).optional(),
    isClosedSource: z.boolean().default(false),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Alessandro Trysh'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
  'blog': blogCollection,
};
