**Estado:** VIGENTE / PRIORIDAD ABSOLUTA  
**Protocolo:** OEDP-V11.0 (Granular i18n & Dictionary Compilation)  
**Objetivo:** Garantizar que cada "Aparato Lego" sea lingüísticamente autónomo y que el ecosistema completo cuente con traducciones estrictamente tipadas y auditadas por IA.

## 1. La Doctrina del "Silo Lingüístico"
Queda prohibida la existencia de un archivo global de traducciones (Ej: `locales/es.json` gigante en la raíz del frontend). Las traducciones pertenecen a la lógica que las utiliza. 
Cada aparato debe tener una carpeta `src/lib/i18n/` que contenga exclusivamente las cadenas de texto correspondientes a su propio dominio.

## 2. Archivos Obligatorios por Aparato
Todo módulo que exponga texto (errores, UI, logs legibles) debe incluir:
1. `pt-BR.json`: Idioma principal (Portugués de Brasil).
2. `es-ES.json`: Idioma secundario (Español).
3. `en-US.json`: Idioma terciario (Inglés).
4. `[ModuleName]I18n.schema.ts`: Un esquema de Zod que defina la interfaz exacta del diccionario.

## 3. Aduana de ADN para Diccionarios
Los archivos JSON no son seguros por naturaleza. Por tanto, el script de pre-build utilizará el `I18n.schema.ts` de cada módulo para validar los JSONs. Si el desarrollador olvida traducir una clave en `en-US.json` pero la añadió en `pt-BR.json`, el Zod Schema fallará en tiempo de compilación (CI/CD) bloqueando el despliegue. Cero UI rota.

## 4. Ensamblaje en Pre-Build (The Dictionary Builder)
Un motor de pre-build en `tools/scripts/i18n-builder.ts` recorrerá recursivamente todos los `libs/**/src/lib/i18n/*.json` del proyecto.
- Extraerá los JSONs.
- Los anidará bajo el nombre del paquete (Ej: `"@floripa-dignidade/analytics": { ... }`).
- Generará los diccionarios globales optimizados en `.cache/i18n/` que la aplicación Next.js consumirá en tiempo de ejecución (Next-Intl o similar).

---


