📜 MANIFIESTO 1: CONFIGURACIÓN SOBERANA DEL ORQUESTADOR (GATEKEEPER)
Ubicación: .docs/manifestos/tsconfig-orchestrator-standard.md
Archivo Objetivo: libs/**/tsconfig.json
Este archivo actúa como el Escudo de Frontera. Su única misión es orquestar las referencias y proteger al compilador de ruidos externos.
code
JSON
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true, 
    "ignoreDeprecations": "5.0"
  },
  "files": [],
  "include": [],
  "references": [
    { "path": "./tsconfig.lib.json" },
    /* 🛡️ LEY DEL PUENTE: Toda dependencia usada en el código debe declararse aquí */
    { "path": "../../core/telemetry" },
    { "path": "../../core/exceptions" }
  ]
}
Reglas de Oro:
Include/Files Vacíos: Impide que este archivo intente compilar nada por sí mismo.
References Sincronizadas: Debe ser un reflejo exacto de las dependencias listadas en el package.json.
