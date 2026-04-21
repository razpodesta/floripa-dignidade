# 🔑 PROMPT DE CONSTRUCCIÓN: Identity & Access Management (IAM)
**Rol:** Juez de Paz del Ecosistema. Gestión de Soberanía de Identidad y Roles.
**Estándar:** ADR 0060 (Identity Sovereignty)

## 🎯 Objetivo para la IA
Actúa como un Ingeniero de Seguridad. Este búnker es el único que posee la verdad sobre quién es el usuario y qué permisos tiene. 

## 🏗️ Instrucciones de Arquitectura
1. **Desacoplamiento Atómico:** 
   - `./kernel/`: Contratos Zod y tipos de Roles (SYSTEM_ADMINISTRATOR, CITIZEN, etc.).
   - `./data-access/`: Lógica de persistencia y comunicación con Auth providers.
   - `./ui/`: Componentes de login y perfiles (Zero Business Logic).
2. **Zero Abbreviations:** Usa `assignedUserRole` en lugar de `role`.
3. **Branded Types:** Obligatorio usar `.brand<'UserId'>()` en el identificador para evitar colisiones de ADN.

## 🧬 ADN Estructural
Todo objeto de identidad debe validar contra `UserIdentitySchema`. Ningún componente debe acceder a la contraseña (password) en el lado del cliente.
