/**
 * @section PMF Engine DNA - E-Pública Raw Protocol Schema
 * @description Contrato inmutable que define la estructura física de la API
 * gubernamental (E-Pública). Actúa como la frontera táctica de entrada para
 * los datos de ejecución de gastos de la Prefeitura de Florianópolis.
 *
 * Protocolo OEDP-V17.0 - ISO Standard Naming & Data Sovereignty.
 * SANEADO Zenith: Exportación de ADN tipado para lógica 'Zero-Dependency'.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @section ADN de Movimientos Financieros
 * @description Mapea la lista 'listMovimentos' que contiene los flujos de caja reales.
 */
export const EPublicaMovementSchema = z.object({
  dataMovimento: z.string()
    .describe('Fecha efectiva del movimiento financiero en formato ISO (YYYY-MM-DD).'),

  tipoMovimento: z.string().nullable()
    .describe('Identificador técnico del tipo de transacción (Pago/Estorno/Anulación).'),

  valorMovimento: z.number()
    .describe('Monto financiero neto ejecutado en esta transacción específica.'),
}).readonly();

/**
 * 🛡️ SANEADO Zenith: Exportación de ADN Tipado.
 * Requerido por 'CalculateExecutedFinancialBalance.ts' para operar sin importar Zod.
 */
export type IEPublicaMovementSnapshot = z.infer<typeof EPublicaMovementSchema>;

/**
 * @name EPublicaExpenseSchema
 * @description Esquema maestro para un registro de gasto (Despesa) individual.
 */
export const EPublicaExpenseSchema = z.object({
  registro: z.object({

    /** DATOS DEL EMPENHO (Autorización Legal) */
    empenho: z.object({
      emissao: z.string().describe('Fecha de emisión de la orden de gasto.'),
      numero: z.number().describe('Número identificador único del empenho gubernamental.'),
      objetoResumido: z.string().describe('Descripción técnica del bien o servicio adquirido.'),
      especie: z.string().describe('Clasificación técnica de la especie de gasto.'),
      categoria: z.string().describe('Categoría contable del registro.'),
      contrato: z.string().nullable().describe('Referencia al contrato legal vinculado.'),
      licitacao: z.string().nullable().describe('Referencia al proceso licitatorio original.'),
    }).readonly(),

    /** JERARQUÍA PRESUPUESTARIA (Funcional) */
    despesa: z.object({
      funcao: z.object({ codigo: z.number(), denominacao: z.string() }),
      subfuncao: z.object({ codigo: z.number(), denominacao: z.string() }),
      programa: z.object({ codigo: z.number(), denominacao: z.string() }),
      acao: z.object({ codigo: z.number(), denominacao: z.string() }),
    }).readonly(),

    /** NATURALEZA CONTABLE (Plan de Cuentas) */
    naturezaDespesa: z.object({
      categoriaEconomica: z.object({ codigo: z.number(), denominacao: z.string() }),
      grupo: z.object({ codigo: z.number(), denominacao: z.string() }),
      modalidadeAplicacao: z.object({ codigo: z.number(), denominacao: z.string() }),
      elemento: z.object({ codigo: z.number(), denominacao: z.string() }),
      detalhamento: z.object({ codigo: z.number(), denominacao: z.string() }),
    }).readonly(),

    /** IDENTIDAD FISCAL DEL PROVEEDOR */
    fornecedor: z.object({
      pessoa: z.object({
        nome: z.string().describe('Razón social o nombre legal del beneficiario del pago.'),
        cpfCnpj: z.string().describe('Identificación fiscal (CNPJ/CPF) para cruce de datos.'),
      }).readonly(),
    }).readonly(),

    /** HISTORIAL DE FLUJO DE CAJA */
    listMovimentos: z.array(EPublicaMovementSchema)
      .describe('Colección inmutable de transacciones financieras vinculadas al registro.'),

  }).readonly(),
}).readonly();

/** 🛡️ ADN Tipado: Interfaz cruda para el orquestador de red. */
export type IEPublicaExpenseRaw = z.infer<typeof EPublicaExpenseSchema>;

/**
 * @name EPublicaApiResponseSchema
 * @description Contrato maestro para el envoltorio de la API gubernamental.
 */
export const EPublicaApiResponseSchema = z.object({
  informacao: z.string()
    .describe('Metadatos descriptivos de la respuesta del servidor.'),

  ultimaAtualizacao: z.string()
    .describe('Marca temporal de la última sincronización de la base gubernamental.'),

  totalRegistros: z.number()
    .describe('Cantidad total de elementos que cumplen los criterios de búsqueda.'),

  registros: z.array(EPublicaExpenseSchema)
    .describe('Colección de registros de gasto capturados.'),
}).readonly();

/** 🛡️ ADN Tipado: Respuesta integral de la API de Transparencia. */
export type IEPublicaApiResponse = z.infer<typeof EPublicaApiResponseSchema>;
