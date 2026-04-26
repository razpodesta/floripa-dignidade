/**
 * @section CMS Infrastructure - Admin Catch-all Page
 * @description Orquestador de renderizado para el panel administrativo de Payload CMS.
 * Gestiona dinámicamente la jerarquía de rutas bajo '/admin' mediante el paso
 * directo de promesas al motor de vistas, cumpliendo con el rigor de Next.js 15.
 *
 * Protocolo OEDP-V16.0 - High Performance & Async Contract Integrity.
 * Vision: Zero-Lag Administrative Interface.
 *
 * SANEADO Zenith: Eliminación de 'await' manual en la delegación de promesas (TS2739).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { generatePageMetadata, RootPage } from '@payloadcms/next/views';
import type { Metadata } from 'next';

/* 1. Configuración Soberana y Mapa de Dependencias */
import configReference from '../../../../payload.config';
import { importMap } from '../importMap';

/**
 * @interface IAdminPageProperties
 * @description Contrato de propiedades inyectadas por Next.js 15.
 * Las propiedades 'params' y 'searchParams' son Promesas obligatorias.
 */
interface IAdminPageProperties {
  readonly params: Promise<{
    segments: string[];
  }>;
  readonly searchParams: Promise<{
    [key: string]: string | string[];
  }>;
}

/**
 * Generador de Metadatos Dinámicos.
 * SANEADO Zenith: Se pasan las promesas 'params' y 'searchParams' íntegras
 * al motor de Payload para que este gestione su resolución interna.
 *
 * @param properties - Propiedades asíncronas de la ruta.
 * @returns {Promise<Metadata>} Metadatos procesados por el motor de Payload.
 */
export const generateMetadata = ({
  params,
  searchParams,
}: IAdminPageProperties): Promise<Metadata> => {
  return generatePageMetadata({
    config: configReference,
    params,
    searchParams,
  });
};

/**
 * Componente Raíz de la Interfaz Administrativa.
 *
 * @param properties - Propiedades de la solicitud (Promesas).
 * @returns {Promise<React.ReactElement>} La vista administrativa sincronizada.
 */
const AdminPage = ({
  params,
  searchParams,
}: IAdminPageProperties): Promise<React.ReactElement> => {
  /**
   * 🛡️ SANEADO Zenith: Inyección directa de promesas al RootPage.
   * La versión estable 3.84.x está optimizada para recibir los objetos Promise
   * y realizar el streaming de datos hacia el cliente de forma asíncrona.
   */
  return RootPage({
    config: configReference,
    importMap,
    params,
    searchParams,
  });
};

export default AdminPage;
