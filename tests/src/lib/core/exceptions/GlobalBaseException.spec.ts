/**
 * @section Quality Assurance - Mirror Test
 * @description Valida la integridad de la clase base de excepciones.
 * Protocolo OEDP-V10.0 - Mirror Testing Architecture.
 */

import { GlobalBaseException } from '@floripa-dignidade/exceptions';

/**
 * Mock institucional para instanciar una clase abstracta.
 * SANEADO: Se añade modificador 'public' para cumplimiento ISO 25010.
 */
class TestableException extends GlobalBaseException {
  public constructor(message: string) {
    super(message, 'INTERNAL_SYSTEM_FAILURE', 500);
  }
}

describe('Aparato: GlobalBaseException', () => {
  it('debe capturar un snapshot forense inmutable al ser instanciada', () => {
    const errorMessageLiteral = 'ERROR_DE_PRUEBA_TECNICA';
    const exceptionInstance = new TestableException(errorMessageLiteral);

    expect(exceptionInstance.message).toBe(errorMessageLiteral);
    expect(exceptionInstance.runtimeContextSnapshot).toBeDefined();
    expect(exceptionInstance.runtimeContextSnapshot['httpStatusCodeNumeric']).toBe(500);
  });
});
