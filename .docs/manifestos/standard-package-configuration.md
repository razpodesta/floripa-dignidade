🏛️ 1. La Doctrina de la Versión Única (Root SSOT)
Para erradicar la fragmentación de dependencias y asegurar la estabilidad del ecosistema:
Fuente Única de Verdad (SSOT): El package.json ubicado en la raíz del monorepo es el único dueño de las versiones de librerías externas (React, Zod, Tailwind, Lucide, etc.).
Sincronía Obligatoria: Ningún búnker (apps/ o libs/) tiene permitido declarar versiones distintas a las de la raíz.
Protocolo workspace:*: Toda dependencia entre búnkeres internos del enjambre debe utilizar estrictamente el protocolo de versión de workspace.
✅ Correcto: "@floripa-dignidade/telemetry": "workspace:*"
❌ Prohibido: "@floripa-dignidade/telemetry": "1.0.0"
🚀 2. Ley Next.js 16+ (Purga de Cronología)
El ecosistema opera físicamente bajo Next.js 16.1.6 y React 19.
Erradicación: Cualquier mención a "Next.js 15" en TSDocs, comentarios, archivos de configuración o manifiestos se considera Deuda Técnica Crítica y debe ser actualizada a "Next.js 16+" en el acto de cualquier refactorización.
Compatibilidad: La configuración de los package.json debe estar optimizada para Turbopack y el motor de renderizado de Next.js 16.
🧬 3. Estructura Estándar del Aparato (Librerías)
Cada libs/**/package.json debe cumplir con este contrato físico para asegurar un Tree-shaking del 100% y latencia cero en el Edge:
code
JSON
{
  "name": "@floripa-dignidade/[category]-[function]",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "sideEffects": false,
  "description": "ISO-Standard: [Descripción breve de la responsabilidad única].",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "dependencies": {
    "@swc/helpers": "~0.5.18"
  },
  "nx": {
    "tags": [
      "scope:[core|engines|modules|shared]",
      "type:[logic|data|ui|schema]",
      "platform:[isomorphic|node|web]"
    ]
  }
}
Reglas de los campos:
type": "module": Garantiza que el código sea tratado como ESM Puro (Native Next.js 16 compliance).
sideEffects": false: Indica a Vercel/Turbopack que el aparato es puro, permitiendo la eliminación agresiva de código muerto.
exports": Prohíbe el uso de main o module obsoletos. Al apuntar a src/index.ts, Nx resuelve la fuente en desarrollo y el dist en producción de forma líquida.
🎨 4. Protocolo de Deep Exports (Shared Visual Foundry)
El búnker @floripa-dignidade/shared es el único autorizado para exponer sub-rutas físicas para evitar el inflado del bundle:
code
JSON
"exports": {
  ".": "./src/index.ts",
  "./design-system": "./src/lib/design-system/index.ts",
  "./ui-primitives": "./src/lib/ui-primitives/index.ts",
  "./composite-ui": "./src/lib/composite-ui/index.ts",
  "./state-store": "./src/lib/utility/state-store/index.ts"
}
🛠️ 5. Auditoría de Salud del Grafo (Nx Tags)
Para que el Neural Sentinel y el Linter bloqueen importaciones ilegales, el objeto "nx" dentro del package.json debe ser un reflejo exacto de las etiquetas en project.json.
Scope: Define la jerarquía (Core no puede importar de Modules).
Type: Define la naturaleza (UI no puede importar de Data).
Platform: Define el runtime (Web no puede importar de Node nativo).
🕵️ Diagnóstico de Nivelación Inmediata
He detectado que en el snapshot actual:
Varios archivos package.json en libs/modules/ aún poseen la propiedad "main" en lugar de "exports".
Persisten comentarios que mencionan la compatibilidad con Next.js 15.
La propiedad "sideEffects": false falta en el 60% de los aparatos lógicos.


SE RESPETARAN SIEMPRE LOS NOMBRES EXISTENTES DE LOS PACKAGES QUEDEBEM CONSIDIR SEGUN LA INFORMACION EN .DOCS Y AGREGAR LA AUTHORIA RAZ PODESTA QUE PUEDES EXTARER DE LOS APARATOS Y LA LICNEIA ES UNLICENSED
