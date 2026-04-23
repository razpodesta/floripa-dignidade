**Estado:** VIGENTE 
**Protocolo:** OEDP-V9.0 (Orchestrated Engineering Protocol)  

## 1. El Principio de Simetría
Se establece la obligatoriedad de coincidencia absoluta entre:
- **Identifier:** El nombre en `project.json`.
- **Package Name:** El campo `name` en `package.json` (incluyendo el scope @floripa-dignidade).
- **Import Path:** La clave definida en `tsconfig.base.json`.

## 2. Clasificación de Aparatos por Construcción
### 2.1. Buildable Libraries (`type:data`, `type:logic`)
Librerías que poseen lógica pesada o que serán candidatas a paquetes NPM independientes. 
- **Requisito:** Deben poseer un target `build` con `swc` y generar tipos (`d.ts`).
- **Uso:** Core, Engines, Shared Logic.

### 2.2. Internal Libraries (`type:ui`, `type:schema`)
Librerías que se compilan directamente con el consumidor final (Next.js).
- **Ventaja:** Menor tiempo de build total y mayor facilidad de refactorización.

## 3. Matriz de Etiquetas Extendida (Nx Metadata)
Todo aparato debe declarar su entorno de ejecución:
- `platform:web`: Código con acceso al DOM.
- `platform:node`: Código con acceso a FS/Network.
- `platform:isomorphic`: Código agnóstico (validaciones, tipos).

## 4. Auditoría de Mantenibilidad
Cada `package.json` debe reflejar únicamente las dependencias que utiliza. Se prohíbe la herencia implícita de dependencias de la raíz si el aparato es una "Buildable Library".

5. Protocolo de Resolución de Rutas (Clean Paths)
Para garantizar la máxima velocidad de resolución en Turbopack y simplificar la DX (Developer Experience), queda estrictamente prohibido el uso de extensiones de archivo (.ts, .js, .tsx) en las sentencias de importación y exportación dentro del código fuente.
Razón: El compilador (SWC) y el orquestador (Next.js) gestionan las extensiones automáticamente. Incluirlas en el código fuente crea una redundancia que genera errores de mapeo en el TS Server.

---


