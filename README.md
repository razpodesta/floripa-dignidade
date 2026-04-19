🕊️ Floripa Dignidade Ecosystem
![alt text](https://img.shields.io/badge/Nx-Cloud-blue?logo=nx&style=for-the-badge)

![alt text](https://img.shields.io/badge/pnpm-8.x-orange?logo=pnpm&style=for-the-badge)

![alt text](https://img.shields.io/badge/Next.js-15-black?logo=next.js&style=for-the-badge)

![alt text](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&style=for-the-badge)

![alt text](https://img.shields.io/badge/AI-Audited-brightgreen?logo=openai&style=for-the-badge)
Plataforma tecnológica de vanguardia para la defensa de los Derechos Humanos y la Dignidad Humana en Florianópolis.
📖 Visión General
Floripa Dignidade no es solo un blog de noticias; es una infraestructura digital de respuesta social. Basado en un Sistema Lego (Arquitectura Modular Desacoplada), este monorepo orquesta aplicaciones de Next.js, un CMS potente (Payload) y agentes de Inteligencia Artificial para la recepción de denuncias y auditoría de salud algorítmica.
🏗️ Arquitectura: El Sistema Lego
Nuestra arquitectura se basa en la independencia absoluta de sus partes ("Aparatos"). Cada componente es una pieza de Lego que se puede auditar, testear y reutilizar sin afectar el ecosistema global.
code
Mermaid
graph TD
    subgraph Apps
        A[floripa-dignidade - Frontend]
        B[content-manager-system - Payload CMS]
    end

    subgraph Modules [Lego Modules]
        M1[newsletter-engine]
        M2[human-rights-news]
        M3[ai-denuncias-whatsapp]
    end

    subgraph Core [The Foundations]
        C1[core-health]
        C2[core-logger]
        C3[core-metrics]
        C4[core-errors]
    end

    A --> M1
    A --> M2
    B --> M2
    M3 --> C2
    Modules --> Core
🛠️ Stack Tecnológico de Punta
Tecnología	Rol	Beneficio
Nx Monorepo	Orquestador	Caché distribuida y límites arquitectónicos estrictos.
pnpm	Package Manager	Instalaciones ultra-rápidas y gestión eficiente de symlinks.
Payload CMS	Content Engine	Headless CMS basado en Next.js con Local API para latencia cero.
Lucide Icons	Visuals	Iconografía tree-shakeable y consistente.
Zod	Data Integrity	Validación de contratos i18n y esquemas de API.
Jest & Playwright	QA	Auditoría unitaria y de extremo a extremo (E2E).
🤖 IA & Observabilidad: Auditoría de Salud
Este proyecto implementa una capa de IA-Native Observability. No solo monitoreamos errores, auditamos la lógica.
core-health: Algoritmo de salud global que utiliza IA para predecir fallos en los conectores de API (Resend, Database, WhatsApp Agent).
IA Auditing: Los agentes de IA revisan los cambios en las piezas de Lego (Workspaces) para asegurar que se respeten los principios SOLID y DRY antes de cada build.
Agente de Denuncias (WhatsApp): (Próximamente) Integración con agentes conversacionales capaces de recibir testimonios y denuncias de violaciones de derechos humanos vía WhatsApp, categorizándolos automáticamente para el equipo legal de la ONG.
📰 Funcionalidades Principales
1. Centro de Noticias de Derechos Humanos
Un portal dinámico optimizado para SEO, con internacionalización (i18n) granular.
CMS Integrado: Gestión fluida vía content-manager-system.
SSR & ISR: Generación estática para velocidad máxima y actualización en tiempo real.
2. Gestión de Newsletters
Sistema de suscripción desacoplado con validación Zod y envío vía Resend.
Esquemas i18n para multilingüismo (ES, PT, EN).
Componentes Web desacoplados listos para ser inyectados en cualquier app.
3. Sistema de Denuncias Seguro
Interfaz intuitiva para la reporte de vulnerabilidades sociales.
📂 Estructura del Monorepo
code
Text
floripa-dignidade/
├── apps/
│   ├── floripa-dignidade/        # App Router Frontend
│   └── content-manager-system/   # Payload CMS Admin
├── libs/
│   ├── core/                     # Bloques transversales
│   │   ├── health/               # Auditoría de salud algorítmica
│   │   ├── logger/               # Sistema unificado de logs
│   │   └── errors/               # Manejo de excepciones
│   └── modules/                  # Aparatos de negocio
│       ├── newsletter/           # Lógica de suscripciones
│       └── blog-engine/          # Renderizado de noticias
├── tools/                        # Scripts de pre-build e i18n
└── .docs/                        # Manifiestos de arquitectura
🚀 Guía de Desarrollo
Comienzo Rápido
Instalar dependencias:
code
Bash
pnpm install
Levantar el ecosistema completo (Frontend + CMS):
code
Bash
pnpm dev:all
Ejecutar auditoría de calidad (Lint + Test + Typecheck):
code
Bash
pnpm nx run-many -t lint test typecheck
Convenciones de Commits
Seguimos el estándar Conventional Commits:
feat(newsletter): nueva funcionalidad.
fix(core): corrección en bloques core.
chore(workspace): tareas de mantenimiento.
⚖️ Licencia y Compromiso Social
Este proyecto es propiedad de la ONG Floripa Dignidade. El código está diseñado para ser auditado y transparente, garantizando que la tecnología esté siempre al servicio del ser humano.
