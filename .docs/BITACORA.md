📜 BITÁCORA DE ESTADO: PROYECTO FLORIPA DIGNIDADE
Protocolo Activo: OEDP-V13.0 (Atomic Visual DNA)
Arquitecto Responsable: IA Sentinel (en colaboración con Senior Lead)
Estado General: Infraestructura Core y Motores de Inteligencia NIVELADOS.
🏗️ 1. DECISIONES ARQUITECTÓNICAS (THE LEGO SYSTEM)
Desacoplamiento Absoluto: El monorepo (Nx + pnpm) se rige por la filosofía de "Aparatos Lego". Las apps (apps/) son carcasas vacías; el 100% del valor de negocio reside en libs/.
Protocolo OEDP-V10.0 (Mirror Testing): Se ha purgado todo rastro de Jest, archivos .spec.ts y tsconfig.spec.json de los workspaces de producción. Las pruebas se delegan a un workspace espejo exclusivo para QA para optimizar el despliegue en Vercel.
Configuración de Grado Enterprise:
TS 5.4+: Uso de "module": "Preserve" y "moduleResolution": "bundler" para máxima compatibilidad con Vercel Edge y Turbopack.
ESM-First: Todos los aparatos usan "type": "module" y el campo "exports" para blindar el encapsulamiento.
Zero Abbreviations (ISO Standards): Prohibido el uso de abreviaturas. El código se lee como literatura técnica.
🛠️ 2. ESTADO DE LOS WORKSPACES (NIVELACIÓN)
A. Capa Core (Cimientos Inmutables)
@floripa-dignidade/analytics: Captura de eventos de usuario y Web Vitals. Implementa requestIdleCallback para no bloquear el Main Thread (Performance First).
@floripa-dignidade/exceptions: Motor global de errores. Clases abstractas puras que preservan el runtimeSnapshot para auditoría forense. Solucionado el error de captureStackTrace para entornos isomórficos.
@floripa-dignidade/telemetry: El sistema nervioso. Cero console.log. Gestiona correlationIdentifier único y mide latencias de ejecución automáticamente con el wrapper traceExecutionTime.
B. Capa de Inteligencia (Engines)
@floripa-dignidade/health-monitor: Vigilante de SRE. Realiza pings lógicos a servicios externos y reporta el pulso vital (UP/DEGRADED/DOWN) a Telemetry.
@floripa-dignidade/health-analysis-engine: El "Neural Sentinel". Arquitectura de próxima generación multi-proveedor (OpenAI, Anthropic, Hugging Face). Diseñado para auto-sanación de código y detección de anomalías cognitivas.
C. Capa Shared (UI Foundry)
Workspace Unificado: libs/shared actúa como el búnker visual único.
Subrutas Estructurales:
/design-system: Design Tokens y ADN de Tailwind.
/ui-primitives: Ladrillos puros (Radix UI + Tailwind).
/composite-ui: Ensambles complejos de Layout.
Soberanía i18n: Cada subruta posee sus propios archivos JSON (PT, ES, EN) y sus esquemas Zod de validación.
🛡️ 3. CONSTITUCIÓN TÉCNICA (LINT & STYLE)
ESLint Flat Config: Implementado con reglas estrictas de Module Boundaries.
type:data solo puede importar de type:core y type:schemas.
Fuerza el uso de interfaces con prefijo I y accesibilidad explícita en clases.
Prettier: Configurado para consistencia absoluta en Git (Single Quote, Trailing Comma, 100 char width).
🚀 4. PENDIENTES E INSTRUCCIONES PARA EL SIGUIENTE HILO
Próximos Pasos Inmediatos:
Nivelación de @floripa-dignidade/identity: Implementar la soberanía de identidad (Roles, Branded Types para UserId, Auth logic desacoplada).
Construcción del i18n-Builder: Script en tools/ para ensamblar los JSON granulares en diccionarios de aplicación.
Implementación de Design Tokens: Definir la escala cromática y tipográfica en shared/design-system.
Instrucción para la IA:
"Eres un Arquitecto de Software Staff. Debes tratar este monorepo como un sistema de misión crítica. No aceptes código que no pase por la aduana Zod ni variables que no sigan la prosa ISO. Tu prioridad es la atomicidad funcional y la observabilidad total."


---

