/**
 * @section CMS Infrastructure - Cloud Storage Plugin
 * @description Configura el adaptador de persistencia para objetos multimedia.
 * Utiliza el protocolo S3-Compatible de Supabase para operar con costo cero.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Cloud Sovereign.
 */

import { s3Storage } from '@payloadcms/storage-s3';
import { MediaVaultCollection } from '../collections/infrastructure/MediaVault.collection';

/**
 * @interface ICloudStorageConfiguration
 * @description Contrato inmutable para la inyección de secretos de almacenamiento.
 */
interface ICloudStorageConfiguration {
  readonly endpointLiteral: string;
  readonly accessKeyIdSecret: string;
  readonly secretAccessKeySecret: string;
  readonly regionLiteral: string;
  readonly bucketNameLiteral: string;
}

/**
 * Genera la configuración del plugin de almacenamiento soberano.
 */
export const CreateCloudStoragePlugin = (configuration: ICloudStorageConfiguration) => {
  return s3Storage({
    collections: {
      [MediaVaultCollection.slug]: true,
    },
    bucket: configuration.bucketNameLiteral,
    config: {
      endpoint: configuration.endpointLiteral,
      credentials: {
        accessKeyId: configuration.accessKeyIdSecret,
        secretAccessKey: configuration.secretAccessKeySecret,
      },
      region: configuration.regionLiteral,
      forcePathStyle: true, // Requerido para la compatibilidad con Supabase
    },
  });
};
