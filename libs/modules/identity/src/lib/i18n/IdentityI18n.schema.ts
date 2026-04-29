/**
 * @section Identity DNA - Linguistic Integrity Schema
 * @description Contrato soberano que define a estrutura obrigatória para os
 * dicionários de tradução do búnker de identidade. Garante que cada mensagem
 * de erro, descrição de esquema e papel institucional possua uma representação
 * textual validada, eliminando textos estáticos na lógica de negócio.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & ReadOnly Integrity.
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { z } from 'zod';

/**
 * @name IdentityI18nSchema
 * @description Aduana de validação para as almas linguísticas do domínio de identidade.
 * Implementa a imutabilidade absoluta para o motor de compilação i18n.
 */
export const IdentityI18nSchema = z.object({

  /**
   * @section Metadados de Esquema
   * Descrições técnicas utilizadas para gerar documentação e tooltips dinâmicos.
   */
  schemas: z.object({
    FULL_NAME_DESCRIPTION: z.string()
      .describe('Descrição técnica do campo de nome civil completo.'),

    EMAIL_DESCRIPTION: z.string()
      .describe('Descrição técnica do campo de correio eletrônico institucional.'),

    AVATAR_DESCRIPTION: z.string()
      .describe('Descrição técnica do recurso visual de identidade.'),

    TRUST_LEVEL_DESCRIPTION: z.string()
      .describe('Explicação detalhada do coeficiente de credibilidade bayesiana do cidadão.')
  }),

  /**
   * @section Sinais de Erro (Exceptions)
   * Mensagens localizadas para falhas de integridade e autoridade.
   */
  errors: z.object({
    INVALID_AVATAR_URL: z.string()
      .describe('Mensagem emitida quando a URL da imagem viola padrões de segurança.'),

    TRUST_LEVEL_OUT_OF_BOUNDS: z.string()
      .describe('Alerta quando o score de confiança foge da escala 0.0 a 1.0.'),

    IDENTITY_NOT_FOUND: z.string()
      .describe('Erro de busca quando o identificador de cidadão não existe.'),

    UNAUTHORIZED_PROVIDER: z.string()
      .describe('Bloqueio quando o provedor de identidade social não é confiável.')
  }),

  /**
   * @section Catálogo de Papéis (RBAC)
   * Representação textual de cada nível de autoridade na rede.
   */
  roles: z.object({
    INFRASTRUCTURE_SOVEREIGN_AUDITOR: z.string(),
    PLATFORM_GLOBAL_MANAGER: z.string(),
    ORGANIZATION_ADMINISTRATOR: z.string(),
    ORGANIZATION_OPERATOR: z.string(),
    CITIZEN_REGISTERED: z.string(),
    CITIZEN_ANONYMOUS: z.string()
  })

}).readonly();

/**
 * @section ADN Tipado (Verbatim Module Syntax)
 * Interface inalterável para o motor de tradução.
 */
export type IIdentityI18n = z.infer<typeof IdentityI18nSchema>;
