# 🏛️ Manifiesto de Integridad Estructural: La Doctrina del Grafo Sincronizado
**Versión:** 15.0.0 (Zenith Build Standard)
**Estado:** PRIORIDAD ABSOLUTA

## 1. La Ley de la Triple Sincronía
Para garantizar estabilidad de Reloj Suizo en búnkeres distribuidos, todo aparato debe cumplir con tres capas de resolución idénticas:

1.  **Capa Global (tsconfig.base.json):** Los `paths` deben apuntar siempre a la lógica fuente (`libs/*/src/index.ts`). Esto garantiza que el IDE (VSCode) tenga inteligencia en tiempo real.
2.  **Capa de Búnker (Solution Pattern):** Cada librería posee un `tsconfig.json` (Escudo/Orquestador) que referencia a un `tsconfig.lib.json` (Emisor). Queda prohibida la emisión de código desde el archivo orquestador.
3.  **Capa de Orquestación (nx.json):** La construcción de un búnker depende físicamente de la construcción previa de sus dependencias (`dependsOn: ["^build"]`).

## 2. Configuración Zenith de Alta Performance (TSC + SWC)
Adoptamos el modelo híbrido para maximizar la velocidad de Vercel:
*   **SWC:** Encargado del empaquetado y transpilación rápida del búnker.
*   **TSC (Build Mode):** Encargado exclusivamente de la emisión de ADN (.d.ts) y validación del grafo de tipos mediante `tsc -b`.

## 3. Resolución de Paradojas (Anti-Regresión)
*   **ignoreDeprecations:** Debe ser estrictamente `"5.0"` hasta la migración total a TS 7.0.
*   **moduleResolution:** Strictly `"bundler"`.
*   **module:** Strictly `"Preserve"`. 
*   **rootDir:** En búnkeres de lógica, debe ser siempre `src` para evitar que el compilador capture archivos fuera de la frontera.

## 4. Trazabilidad Forense de Tipos
Las salidas de tipos (.d.ts) deben desviarse a `dist/out-tsc/libs/...`. Queda terminantemente prohibido que un proceso de construcción genere archivos en la carpeta `src`.
🛡️ Configuración Maestra del Workspace (Reloj Suizo)
Para alinear todo el ecosistema y que el build sea exitoso, presento la configuración definitiva de los aparatos base:
1. Constitución Madre (tsconfig.base.json)
Misión: Inteligencia para el desarrollador y rutas fuente.
code
JSON
{
  "compilerOptions": {
    "baseUrl": ".",
    "target": "ES2022",
    "ignoreDeprecations": "5.0",
    "module": "Preserve",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "emitDeclarationOnly": true,
    "composite": true,
    "skipLibCheck": true,
    "paths": {
      "@floripa-dignidade/*": ["libs/*/src/index.ts"],
      "@floripa-dignidade/scripts": ["scripts/src/run-weaver.ts"]
    }
  }
}
2. Cerebro de Ejecución (nx.json)
Misión: Orquestar el orden físico de la construcción.
code
JSON
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true,
      "outputs": ["{workspaceRoot}/dist/out-tsc/{projectRoot}"]
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "cache": true
    }
  }
}
3. El Patrón Escudo en Búnkeres (libs/**/tsconfig.json)
Misión: Impedir que TSC ensucie el código fuente.
code
JSON
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true, 
    "ignoreDeprecations": "5.0"
  },
  "references": [{ "path": "./tsconfig.lib.json" }]
}
