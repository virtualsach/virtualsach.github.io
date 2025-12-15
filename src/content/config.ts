import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.date().optional(),
        pubDate: z.date().optional(),
        description: z.string().optional(),
        draft: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
    }).transform((data) => ({
        ...data,
        date: data.date || data.pubDate || new Date(),
    })),
});

const projects = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        role: z.string().optional(),
        tags: z.array(z.string()).optional(),
        summary: z.string().optional(),
    }),
});

const pages = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.date().optional(),
        description: z.string().optional(),
        draft: z.boolean().optional(),
    }),
});

export const collections = { blog, projects, pages };
