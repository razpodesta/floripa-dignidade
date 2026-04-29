📜 MANIFIESTO 2: CONFIGURACIÓN DEL EMISOR DE ADN (EMITTER)
Ubicación: .docs/manifestos/tsconfig-lib-emitter-standard.md
Archivo Objetivo: libs/**/tsconfig.lib.json
Este archivo define la física de la compilación. Es el encargado de emitir el ADN (.d.ts) para que otros búnkeres lo consuman.
code
JSON
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../../dist/out-tsc/libs/[category]/[name]",
    "tsBuildInfoFile": "../../../dist/out-tsc/libs/[category]/[name]/tsconfig.lib.tsbuildinfo",
    
    /* --- INTEGRIDAD SOBERANA --- */
    "composite": true,           /* Habilita la compilación incremental en el grafo */
    "declaration": true,         /* Emite las firmas de ADN (.d.ts) */
    "declarationMap": true,      /* Permite el salto al código fuente desde el IDE */
    "emitDeclarationOnly": true, /* Solo emitimos ADN, SWC se encarga de la lógica */
    "rootDir": "src",            /* Frontera física inalterable */
    
    /* --- RESOLUCIÓN NEXT-GEN (Next.js 16 Ready) --- */
    "module": "Preserve",
    "moduleResolution": "bundler",
    "verbatimModuleSyntax": true, /* Fuerza la separación entre tipos y lógica */
    "isolatedModules": true,

    /* --- ADN DEL ENTORNO --- */
    "types": ["node"],
    "lib": ["ES2022", "DOM", "DOM.Iterable"] /* Resuelve errores como 'crypto' o 'fetch' */
  },
  "include": ["src/**/*.ts", "src/**/*.json"],
  "exclude": [
    "src/**/*.spec.ts",
    "dist",
    "out-tsc",
    "node_modules"
  ]
}
🏛️ LA VISIÓN HIPER-HOLÍSTICA: EL "RELOJ SUIZO"
Para que el sistema funcione con Altísimo Performance, el build debe seguir este flujo:
Capa Base (Core): Emite sus .d.ts primero.
Capa Media (Engines/Modules): Lee los .d.ts de Core (vía Project References) y emite los suyos.
Capa Aplicación (Shell): Solo consume los .d.ts finales para el type-checking.

---

