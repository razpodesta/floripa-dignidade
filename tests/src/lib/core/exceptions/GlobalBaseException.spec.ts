/**
 * @section Quality Assurance - Mirror Test
 * @description Valida la integridad de la clase base de excepciones y su 
 * capacidad para capturar snapshots inmutables de memoria.
 *
 * Protocolo OEDP-V17.0 - Mirror Testing Architecture & Sovereign Data.
 * SANEADO Zenith: Inyección de Branding de Error (ErrorCode).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { GlobalBaseException } from '@floripa-dignidade/exceptions';

/** 🛡️ SANEADO Zenith: Importación del tipo nominal para la firma del constructor */
import type { ErrorCode } from '@floripa-dignidade/exceptions';

/**
 * Mock institucional para instanciar la clase abstracta bajo el rigor de pruebas.
 * SANEADO: Modificador 'public' explícito y Casting Soberano de ErrorCode.
 */
class TestableException extends GlobalBaseException {
  public constructor(messageLiteral: string) {
    super(
      messageLiteral, 
      'INTERNAL_SYSTEM_FAILURE' as ErrorCode, 
      500
    );
  }
}

describe('Aparato: GlobalBaseException', () => {
  it('debe capturar un snapshot forense inmutable al ser instanciada', () => {
    const errorMessageLiteral = 'ERROR_DE_PRUEBA_TECNICA';
    const exceptionInstance = new TestableException(errorMessageLiteral);

    // 1. Validación de Mensaje
    expect(exceptionInstance.message).toBe(errorMessageLiteral);
    
    // 2. Validación de Inmutabilidad y Entorno
    expect(exceptionInstance.runtimeContextSnapshot).toBeDefined();
    expect(exceptionInstance.runtimeContextSnapshot['httpStatusCodeNumeric']).toBe(500);
    
    // 3. Validación de Identidad de Fallo
    expect(exceptionInstance.operationalErrorCodeLiteral).toBe('INTERNAL_SYSTEM_FAILURE');
  });
});