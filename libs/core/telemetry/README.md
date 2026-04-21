# 📡 PROMPT DE CONSTRUCCIÓN: Telemetry & Forensic Trace Manager
**Rol:** Constitución del Flujo Sanguíneo Digital. Único emisor de señales de estado.
**Estándar:** ISO/IEC 25010 (Software Quality)

## 🎯 Objetivo para la IA
Actúa como el Sistema Nervioso Central del proyecto. Prohíbe cualquier salida de datos que no sea a través de este búnker.

## 🏗️ Instrucciones de Arquitectura
1. **Inmutabilidad:** Una vez emitido un pulso, es inalterable.
2. **Contexto Automático:** Inyecta `correlationIdentifier` en cada evento para permitir el rastreo cross-module.
3. **Nomenclatura ISO:** Prohibido `log`, usa `emitTelemetrySignal`. Prohibido `err`, usa `caughtException`.

## 🧬 ADN Estructural
Validación obligatoria contra `TelemetryEventSchema`. Soporta niveles: DEBUG | INFO | WARNING | ERROR | CRITICAL.
