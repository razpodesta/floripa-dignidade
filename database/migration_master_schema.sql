-- ====================================================================================
-- @section Database Architecture - Sovereign Master Schema
-- @description Infraestructura física para el ecosistema Floripa Dignidade.
-- Implementa tablas inmutables (Ledgers), partición lógica y seguridad RLS.
--
-- Protocolo OEDP-V17.0 - High Performance SRE & Cloud Sovereign.
-- Motor: PostgreSQL 15+ (Supabase Optimized)
-- ====================================================================================

-- ------------------------------------------------------------------------------------
-- ⚙️ EXTENSIONES SOBERANAS
-- ------------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------------
-- 📡 DOMINIO 1: TELEMETRÍA Y SISTEMA NERVIOSO (Append-Only Ledger)
-- ------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_telemetry_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    severity_level VARCHAR(20) NOT NULL,
    module_identifier VARCHAR(100) NOT NULL,
    operation_code VARCHAR(100) NOT NULL,
    correlation_id UUID NOT NULL,
    message TEXT NOT NULL,
    execution_latency_in_milliseconds FLOAT,
    context_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_telemetry_correlation ON public.system_telemetry_logs(correlation_id);
CREATE INDEX idx_telemetry_severity ON public.system_telemetry_logs(severity_level);

-- ------------------------------------------------------------------------------------
-- 📧 DOMINIO 2: NEWSLETTER & COMUNICACIÓN INSTITUCIONAL
-- ------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    subscriber_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_address VARCHAR(255) UNIQUE NOT NULL,
    verification_token VARCHAR(100) NOT NULL,
    preferred_locale VARCHAR(10) DEFAULT 'pt-BR',
    status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION',
    correlation_id UUID NOT NULL,
    activation_correlation_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_token ON public.newsletter_subscribers(verification_token);

-- ------------------------------------------------------------------------------------
-- ⚖️ DOMINIO 3: IDENTIDAD CIUDADANA Y REPUTACIÓN BAYESIANA
-- ------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.citizen_identities_ledger (
    citizen_id UUID PRIMARY KEY, -- Sincronizado con auth.users si se usa Supabase Auth
    trust_weight_score FLOAT DEFAULT 0.1,
    is_verified_human BOOLEAN DEFAULT FALSE,
    assigned_authority_role VARCHAR(50) DEFAULT 'CITIZEN_REGISTERED',
    last_authority_sync_at TIMESTAMPTZ,
    sync_correlation_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------------
-- 🤝 DOMINIO 4: MOTOR DE INTERACCIÓN (Termómetro Popular)
-- ------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_interaction_ledger (
    interaction_id UUID PRIMARY KEY,
    target_entity_id UUID NOT NULL,
    evaluator_identity_id UUID, -- Null para interacciones anónimas
    interaction_polarity NUMERIC NOT NULL,
    semantic_emoticon_intention VARCHAR(50),
    evaluator_public_alias VARCHAR(100),
    evaluator_avatar_url TEXT,
    territorial_context VARCHAR(100) DEFAULT 'FLORIANÓPOLIS_GLOBAL',
    occurrence_timestamp_iso TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interaction_entity ON public.social_interaction_ledger(target_entity_id);

-- ------------------------------------------------------------------------------------
-- 🗺️ DOMINIO 5: MOTOR TERRITORIAL Y GASTOS PÚBLICOS (PMF)
-- ------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.territorial_master_data (
    ibge_id VARCHAR(50) PRIMARY KEY, -- Funciona también para IDs hash 'FD-XXXX'
    name_literal VARCHAR(255) NOT NULL,
    hierarchy_level VARCHAR(50) DEFAULT 'DISTRICT',
    metadata_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb, -- Almacena ContentHash para Sentry
    last_seen_at TIMESTAMPTZ,
    last_sync_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------------
-- 📲 DOMINIO 6: PRESENCIA COGNITIVA Y HARDWARE (PWA Push)
-- ------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_presence_ledger (
    citizen_id UUID PRIMARY KEY REFERENCES public.citizen_identities_ledger(citizen_id) ON DELETE CASCADE,
    availability_status VARCHAR(50) DEFAULT 'OFFLINE',
    custom_status_text VARCHAR(100),
    platform_type VARCHAR(50),
    push_token TEXT,
    correlation_id UUID,
    last_heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------------
-- 📬 DOMINIO 7: BUZÓN DE NOTIFICACIONES INSTITUCIONALES
-- ------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_notifications_ledger (
    notification_id UUID PRIMARY KEY,
    recipient_id VARCHAR(50) NOT NULL, -- UUID ciudadano o 'GLOBAL_BROADCAST'
    priority_level VARCHAR(50) NOT NULL,
    category_tag VARCHAR(50) NOT NULL,
    headline_text VARCHAR(255) NOT NULL,
    body_content TEXT NOT NULL,
    action_route VARCHAR(255),
    interaction_status VARCHAR(50) DEFAULT 'DELIVERED_UNREAD',
    correlation_id UUID NOT NULL,
    mutation_correlation_id UUID,
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_recipient ON public.system_notifications_ledger(recipient_id);

-- ------------------------------------------------------------------------------------
-- 👥 DOMINIO 8: GRUPOS DE COMUNICACIÓN (Action Hubs) & MEMBRESÍAS
-- ------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.communication_groups_ledger (
    group_id UUID PRIMARY KEY,
    display_name VARCHAR(150) NOT NULL,
    slug_identifier VARCHAR(100) UNIQUE NOT NULL,
    description_text TEXT,
    owner_org_id UUID,
    territory_id VARCHAR(50),
    governance_model VARCHAR(50) NOT NULL,
    visibility_mode VARCHAR(50) NOT NULL,
    creator_id UUID NOT NULL,
    correlation_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_memberships_ledger (
    membership_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.communication_groups_ledger(group_id) ON DELETE CASCADE,
    citizen_id UUID NOT NULL,
    membership_status VARCHAR(50) DEFAULT 'ACTIVE',
    delegated_mandatary_id UUID, -- Democracia Líquida
    last_action_correlation_id UUID NOT NULL,
    delegation_correlation_id UUID,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(group_id, citizen_id) -- Regla Upsert: 1 Membresía por ciudadano/grupo
);

-- ------------------------------------------------------------------------------------
-- ✉️ DOMINIO 9: MENSAJERÍA DIRECTA P2P (Threads)
-- ------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.direct_messages_ledger (
    message_id UUID PRIMARY KEY,
    thread_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    body_text TEXT NOT NULL,
    attachments_array UUID
