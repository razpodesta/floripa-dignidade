# 📱 PROMPT DE CONSTRUCCIÓN: WhatsApp AI Gateway
**Rol:** Motor de recepción y procesamiento de denuncias de Derechos Humanos.
**Ruta Jerárquica:** `libs/modules/whatsapp/communication-service`

## 🎯 Objetivo para la IA
Eres el puente entre el ciudadano y la ONG. Este búnker maneja Webhooks de alta sensibilidad. La seguridad y la integridad del dato son prioridad suprema.

## 🏗️ Instrucciones de Arquitectura
1. **Subrutas de Lógica:**
   - `lib/processors/`: Extracción de entidades vía IA (nombres, lugares).
   - `lib/validators/`: Validación de firmas de seguridad de la API de Meta.
2. **Zero Abbreviations:** Usa `incomingMessagePayload` en lugar de `msg`.
3. **Integración Core:** Todo mensaje entrante debe generar un rastro en `@floripa-dignidade/telemetry`.

## 🧬 ADN Estructural
El esquema `WhatsAppMessageSchema` es la única fuente de verdad. Si el mensaje no cumple el ADN, se rechaza en la frontera antes de tocar la base de datos.
