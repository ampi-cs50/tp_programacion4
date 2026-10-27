# Midori's Flow - E-commerce de Indumentaria Técnica y Activewear

**Materia:** Programación IV  
**Trabajo Práctico:** N.º 2 - Integración de back-end y front-end  
**Modalidad:** Individual  
**Autor:** ampi-cs50  
**Stack Principal:** Ruby on Rails 8.1 (API + Back-office) & React 19 (Vite SPA)  

---

## 1. Descripción del Proyecto

**Midori's Flow** es una plataforma de comercio electrónico especializada en indumentaria deportiva técnica y activewear de alto rendimiento (yoga, pilates, running y entrenamiento).

El sistema fue concebido bajo una arquitectura desacoplada que combina:
* **Backend (Ruby on Rails 8.1):** Provee una API REST JSON para la tienda virtual (`/api/v1/*`) y un Back-office administrativo integrado en servidor (`/admin`) para la gestión integral del catálogo, categorías, productos, variantes y órdenes de compra.
* **Frontend (React 19 + Vite):** Single Page Application (SPA) interactiva, responsiva y orientada a la experiencia de usuario (UX). Implementa navegación con React Router DOM, gestión global de estado mediante Context API (autenticación y carrito de compras persistente en `localStorage`), consumo de la API mediante `fetch`, y diseño responsivo adaptativo implementado con unidades relativas `rem`.

---

## 2. Arquitectura y Tecnologías

### Backend (Rails)
* **Framework:** Ruby on Rails 8.1.3 (Ruby 3.4.10)
* **Base de Datos:** SQLite 3 con migraciones y semillas idempotentes (`db/seeds.rb`).
* **Almacenamiento Multimedia:** Active Storage para gestión y entrega de fotografías de catálogo de alta resolución.
* **Autenticación:**
  * **Back-office:** Autenticación basada en sesiones seguras de Rails (`has_secure_password` / BCrypt).
  * **API REST:** Tokens de portador (*Bearer Token*) generados mediante `has_secure_token :api_token`.
  * **Google OAuth 2.0:** Endpoint `/api/v1/auth/google` que valida criptográficamente el token emitido por Google Identity Services a través de la gema oficial `googleauth`.
* **Seguridad y Estilo:** RuboCop (guía de estilo Ruby) y Brakeman (análisis estático de vulnerabilidades de seguridad).

### Frontend (React)
* **Librería UI:** React 19.1 con Vite 8.
* **Enrutamiento:** React Router DOM v7 con rutas protegidas (`ProtectedRoute`).
* **Estado Global:** Context API (`AuthContext` y `CartContext`).
* **Estilos:** CSS Vanilla modular y responsivo, respetando escala tipográfica y espaciados calculados en unidades `rem`.
* **Testing:** Vitest + React Testing Library + jsdom para pruebas automatizadas de interacción de usuario (casos de éxito y manejo de errores de red/validación).

---

## 3. Requisitos Previos

* **Ruby:** versión `>= 3.4.0` (recomendado Ruby 3.4.10).
* **Node.js:** versión `>= 18.0.0` (recomendado Node.js 20+ LTS).
* **npm:** versión `>= 9.0.0`.
* **Bundler:** versión `>= 2.5.0`.

---

## 4. Instalación y Puesta en Marcha

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### 4.1. Configuración del Backend (Rails)

1. **Instalar gemas y dependencias:**
   ```bash
   bundle install
   ```

2. **Configurar variables de entorno:**
   Copia el archivo de plantilla `.env.example` para generar tu `.env` local:
   ```bash
   cp .env.example .env
   ```
   *(Opcional: Si deseas probar el inicio de sesión con Google, configura tu `GOOGLE_CLIENT_ID` en este archivo).*

3. **Inicializar y poblar la Base de Datos:**
   ```bash
   bin/rails db:setup
   bin/rails db:seed
   ```
   *El seeder cargará categorías organizadas jerárquicamente, productos de indumentaria deportiva con variantes de talle/color/stock, imágenes de estudio adjuntas mediante Active Storage, y el usuario administrador de prueba.*

4. **Iniciar el servidor backend:**
   ```bash
   bin/rails server
   ```
   *El servidor quedará disponible en: `http://localhost:3000`.*

---

### 4.2. Configuración del Frontend (React + Vite)

1. **Navegar a la carpeta del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar paquetes npm:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno del frontend:**
   Copia la plantilla de variables de entorno:
   ```bash
   cp .env.example .env
   ```
   *(Por defecto, Vite redirige las peticiones `/api/v1` al backend en el puerto 3000 a través del proxy integrado).*

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   *La tienda virtual estará disponible en: `http://localhost:5173`.*

---

## 5. Credenciales y Cuentas de Acceso

| Rol / Tipo de Usuario | URL de Acceso | Email | Contraseña | Método de Autenticación |
|---|---|---|---|---|
| **Administrador (Back-office)** | `http://localhost:3000/admin` | `admin@midorisflow.com` | `password123` | Sesión tradicional en servidor |
| **Cliente (Tienda Virtual)** | `http://localhost:5173/login` | Registro libre en `/signup` o Google OAuth | Definida por el usuario | Bearer Token (`api_token`) |

---

## 6. Contrato de la API REST

La especificación exhaustiva de todos los endpoints, estructuras de datos de entrada/salida, códigos de estado HTTP, validaciones y ejemplos reproducibles en cURL se encuentra documentada en:

📄 **[Ver Contrato Formal de la API REST](docs/api_contract.md)**

### Resumen de Endpoints Principales (`/api/v1`)

* **Autenticación:**
  * `POST /signup` - Registro de nuevos clientes.
  * `POST /login` - Autenticación con email y contraseña (retorna `api_token`).
  * `POST /auth/google` - Autenticación federada con Google Identity Services.
  * `DELETE /logout` - Cierre de sesión y revocación de credencial (Requiere Bearer Token).
* **Catálogo:**
  * `GET /categories` - Listado jerárquico de categorías y subcategorías.
  * `GET /products` - Catálogo completo con filtrado opcional por categoría (`?category_id=`).
  * `GET /products/:id` - Detalle exhaustivo de producto con variantes, talles, colores y stock disponible.
* **Órdenes de Compra (Protegidos con Bearer Token):**
  * `POST /orders` - Creación de pedido con validación transaccional y descuento de stock.
  * `GET /orders` - Historial de compras del usuario autenticado.
  * `GET /orders/:id` - Detalle completo de orden y artículos comprados.

---

## 7. Pruebas Automatizadas y Calidad de Código

El repositorio implementa suites completas de pruebas automatizadas y herramientas de análisis estático tanto en el backend como en el frontend:

### 7.1. Pruebas del Backend (Rails / Minitest)
Ejecuta las pruebas unitarias y de integración de la API:
```bash
bin/rails test
```
*(Cubre modelos, asociaciones, validaciones de negocio, controladores API y autenticación de tokens).*

### 7.2. Pruebas del Frontend (Vitest + React Testing Library)
Ejecuta las pruebas automatizadas de interacción de usuario en el frontend:
```bash
cd frontend
npm test
```
*(Pruebas de componentes clave como Login y Carrito de compras, cubriendo flujos exitosos, validaciones locales de formularios y manejo controlado de respuestas de error de la API).*

### 7.3. Linters y Seguridad Estática
* **Verificación de estilo y sintaxis Ruby (RuboCop):**
  ```bash
  bundle exec rubocop
  ```
  *(0 ofensas).*
* **Análisis estático de seguridad (Brakeman):**
  ```bash
  bundle exec brakeman --no-pager
  ```
  *(0 advertencias de seguridad).*
* **Compilación de producción del Frontend:**
  ```bash
  cd frontend
  npm run build
  ```
