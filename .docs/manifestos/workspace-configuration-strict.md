**Estado:** VIGENTE / PRIORIDAD ABSOLUTA  
**Protocolo:** OEDP-V10.0 (Mirror Testing & Configuration Purity)  
**Objetivo:** Garantizar la pureza absoluta de los entornos de producción eliminando cualquier artefacto de QA del código fuente de los aparatos, y establecer la configuración de grado Enterprise (Vercel-Optimized) para cada bloque Lego del ecosistema.

---

## 1. Doctrina del "Mirror Testing Workspace"
Queda estrictamente prohibido que un "Aparato Lego" (aplicación o librería) contenga configuraciones de pruebas unitarias o de integración en su directorio de origen. 
Todas las pruebas existirán en un **Workspace Espejo** especializado (Ej: `apps/floripa-dignidade-qa-mirror`), el cual replicará la estructura exacta del monorepo pero contendrá únicamente código de validación. La separación entre lógica de negocio y lógica de aserción debe ser física y absoluta.

## 2. Purgado de Configuraciones Locales (Zero QA Artifacts)
Ningún aparato de negocio alojado en `libs/` o aplicaciones principales en `apps/` tiene permitido contener bajo ninguna circunstancia:
- ❌ Archivos `.spec.ts`, `.test.ts`, `.spec.tsx` o `.e2e.ts`.
- ❌ `jest.config.ts`, `jest.config.cts`, `cypress.config.ts` o equivalentes.
- ❌ `tsconfig.spec.json`.
- ❌ Dependencias de test en su `package.json` interno (`@types/jest`, `ts-jest`, `supertest`, etc.).

---

## 3. Arquitectura Inquebrantable del `package.json` (Vercel & Tree-Shaking)
El `package.json` de cada librería no es un ejecutor de scripts; es el documento de identidad y las fronteras de empaquetado del módulo para Vercel y Nx.

Todo "Aparato Lego" debe cumplir estrictamente con este contrato:
1. **ESM-First Estricto:** Obligatorio declarar `"type": "module"`.
2. **Encapsulamiento Blindado (Module Boundaries):** Prohibido el uso obsoleto de `"main"` o `"module"`. Se debe usar el campo `"exports"` para exponer exclusivamente el `index.ts` compilado. Nadie puede importar archivos internos de una librería saltándose la aduana.
3. **Tree-Shaking Agresivo:** Obligatorio incluir `"sideEffects": false` (salvo que sea un polyfill explícito). Esto permite a Vercel/Turbopack eliminar el 100% del código muerto, previniendo los *Cold Starts* en Serverless Functions.

**Estructura Base Obligatoria:**
```json
{
  "name": "@floripa-dignidade/[nombre-del-modulo]",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "dependencies": {
    // Solo dependencias estrictamente utilizadas en producción
  }
}
4. Orquestación del project.json (Nx Cloud & SWC)
El archivo project.json controla cómo Nx interactúa con el módulo.
Dimensionamiento Tagging: El módulo debe declarar sus 3 dimensiones de etiquetas: scope:*, type:* y platform:*.
Compilador Sub-milisegundo: El motor de compilación para los "Buildable Modules" debe ser SWC (basado en Rust) configurado a través de "executor": "@nx/js:swc".
Caché Distribuida: Todos los targets deben declarar "cache": true y definir correctamente sus inputs y outputs para que Vercel salte la compilación si el hash del código no ha cambiado.
5. Pureza del tsconfig.lib.json y tsconfig.json
El archivo de configuración de TypeScript de cada módulo debe estar orientado 100% a la emisión de código puro.
La resolución de módulos debe ser NodeNext / ESNext.
El campo compilerOptions.types nunca debe incluir "jest", "cypress" o "node" (si el platform es web).
Los arrays de exclude deben bloquear implícitamente la compilación accidental de artefactos de prueba de versiones anteriores (ej. "exclude":["src/**/*.spec.ts", "jest.config.ts"]).
6. Auditoría Nx
El motor de Nx delegará el comando test y e2e exclusivamente al workspace espejo de QA.
Los project.json de cada aparato productivo solo tendrán permitido exponer los siguientes targets:
✅ build
✅ lint
✅ typecheck
Cualquier PR que introduzca el target test en un aparato de libs/ será rechazado automáticamente por el core-ai-audit-brain.

---

## 7. Gobernanza de Dependencias y Versiones (La Purga de Cronología)

Para garantizar que el ecosistema no sufra fragmentación de versiones ni corrupción del árbol de dependencias (`pnpm-lock.yaml`), se establecen dos leyes inquebrantables:

### A. Inmutabilidad del `package.json` Raíz (CLI-Only Mutation)
Queda estrictamente prohibida la edición manual (escritura directa) del archivo `package.json` ubicado en la raíz del monorepo. 
Toda adición, actualización o eliminación de dependencias debe ejecutarse exclusivamente a través del motor de línea de comandos:
- ✅ **Correcto:** `pnpm add <paquete> -w` (Para dependencias globales) o mediante comandos generadores de Nx.
- ❌ **Prohibido:** Abrir `package.json`, teclear `"paquete": "^1.0.0"` y guardar. (Esto corrompe la resolución del Workspace).

### B. Sincronía Documental (Next.js 16+ & React 19)
El ecosistema físico opera sobre **Next.js 16+**. Cualquier comentario en el código, TSDoc o manifiesto que haga referencia a "Next.js 15" es considerado deuda técnica documental ("El Fantasma de la Migración") y debe ser purgado y actualizado a su versión real (Next.js 16) de forma proactiva en cada refactorización. La documentación debe ser un reflejo exacto de la física del servidor.


---


