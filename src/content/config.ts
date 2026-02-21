import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const transformations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/transformations' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = {
  transformations,
};
