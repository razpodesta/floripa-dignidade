1. Sistema de Nomenclatura Profesional (NPM-Ready)
Utilizaremos el scope @floripa-dignidade/. El nombre interno será puramente funcional.
A. Capa Core (Infraestructura Base)
Carpeta Física	Nombre en package.json / project.json	Propósito
libs/core/telemetry	@floripa-dignidade/telemetry	Logger, transporte de eventos y trazas.
libs/core/exceptions	@floripa-dignidade/exceptions	Gestión unificada de errores y códigos ISO.
libs/core/health-monitor	@floripa-dignidade/health-monitor	Verificación de signos vitales del sistema.
libs/core/analytics	@floripa-dignidade/analytics	Captura de métricas de rendimiento (Web Vitals).
B. Capa de Inteligencia (Motores de Análisis)
Carpeta Física	Nombre en package.json / project.json	Propósito
libs/engines/health-analysis	@floripa-dignidade/health-analysis-engine	IA predictiva de fallos de sistema.
libs/engines/logic-audit	@floripa-dignidade/logic-audit-engine	IA de auditoría de calidad de código y SOLID.
C. Capa de Dominios (Módulos de Negocio)
Carpeta Física	Nombre en package.json / project.json	Propósito
libs/modules/newsletter/data	@floripa-dignidade/newsletter-data-access	Lógica de servidor, API y persistencia.
libs/modules/newsletter/ui	@floripa-dignidade/newsletter-ui	Componentes visuales de suscripción.
libs/modules/whatsapp/service	@floripa-dignidade/whatsapp-integration-service	Webhooks y procesamiento de mensajes.
2. Sistema de Etiquetas (Tags) de Nx Profesional
Para que la IA y el Linter bloqueen importaciones ilegales, usaremos un sistema de 3 dimensiones en los project.json:
scope: Define a quién pertenece la lógica.
scope:core, scope:module, scope:shared, scope:app.
type: Define qué contiene el código.
type:ui (Componentes), type:data (Servicios/API), type:logic (Motores), type:schema (Zod/ADN).
platform: Define dónde puede correr.
platform:web, platform:node, platform:isomorphic.
Ejemplo de configuración en libs/core/telemetry/project.json:
code
JSON
{
  "name": "@floripa-dignidade/telemetry",
  "tags": ["scope:core", "type:data", "platform:isomorphic"]
}
3. Listado de Manifiestos (Instrucciones para la IA)
Para que cualquier IA (o desarrollador Staff) pueda continuar el proyecto al leer el snapshot, debemos completar esta biblioteca de manifiestos en .docs/manifestos/.
ID	Nombre del Manifiesto	Contenido Crítico
ADR 0001	Architecture Overview	Filosofía Lego, estructura del monorepo y flujo de datos.
ADR 0002	Naming & Coding Standards	Regla "Zero Abbreviations", PascalCase vs camelCase.
ADR 0003	Module Boundaries	Reglas de tags de Nx: qué módulo puede importar a cuál.
ADR 0004	Data Integrity (SSOT)	Uso de Zod como única fuente de verdad para tipos y validación.
ADR 0005	Observability Strategy	Protocolo de telemetría, niveles de log y rastro forense.
ADR 0006	Internationalization (i18n)	Estrategia de compilación de JSONs granulares a diccionarios.
ADR 0007	AI Interaction Protocol	Cómo los agentes de IA leen y proponen cambios (Context Snapping).
ADR 0008	Testing & QA Standards	Cobertura mínima, uso de Jest para unitarios y Playwright para E2E.
ADR 0009	Mobile-First Engineering	Estrategia de diseño responsivo y performance en redes 3G/4G.


pnpm nx g @nx/workspace:move --project module-whatsapp-engine --destination libs/modules/whatsapp-communication-service
pnpm nx g @nx/react:lib libs/shared/ui-metadata --tags="scope:shared,type:ui"






