import { z } from 'zod';

export const SearchEngineI18nSchema = z.object({
  status: z.object({
    searching: z.string().describe('Texto durante la ejecución del algoritmo'),
    noResults: z.string().describe('Mensaje cuando la búsqueda es estéril'),
    resultsFound: z.string().describe('Contador de hallazgos'),
  }),
  categories: z.object({
    INSTITUCIONAL: z.string(),
    NOTICIA: z.string(),
    DENUNCIA: z.string(),
    RECURSO: z.string(),
  }),
  placeholders: z.object({
    input: z.string().describe('Sugerencia en la barra de búsqueda'),
  })
}).readonly();

export type ISearchEngineI18n = z.infer<typeof SearchEngineI18nSchema>;
