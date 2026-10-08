# E-commerce - API, Back-office & Frontend

Este proyecto consiste en una aplicación web de comercio electrónico (Tienda de productos) con un backend desarrollado en **Ruby on Rails 8.1** y un frontend desarrollado en **React**.

## Objetivo del Sistema
Proveer un sistema robusto que permita a los administradores gestionar el catálogo de productos y visualizar las órdenes (Back-office), mientras que el Frontend consume una API JSON para que los clientes puedan consultar el catálogo, registrarse, iniciar sesión (incluyendo Google OAuth) y realizar compras.

## Estructura del Proyecto
El repositorio contiene tanto el backend (Rails) en el directorio principal, como el frontend (React) en el directorio `/frontend`.

---

## Instalación y Configuración del Backend (Rails)

Sigue estos pasos para levantar el backend localmente:

1. **Instalar dependencias:**
   Asegúrate de tener Ruby 3.4.10 instalado.
   ```bash
   bundle install
   ```

2. **Preparar la Base de Datos:**
   El proyecto utiliza SQLite en desarrollo.
   ```bash
   bin/rails db:setup
   ```

3. **Configurar Variables de Entorno:**
   Asegúrate de configurar el archivo `.env` en la raíz del proyecto para Google OAuth:
   ```env
   GOOGLE_CLIENT_ID=tu_client_id_aqui
   ```

4. **Levantar el servidor backend:**
   ```bash
   bin/rails server
   ```
   El backend se ejecutará por defecto en `http://localhost:3000`.

---

## Instalación y Configuración del Frontend (React)

1. **Ir al directorio del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   Asegúrate de tener Node.js instalado.
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**
   Crea un archivo `.env` dentro de `frontend/` y configura las variables necesarias (ej: URL de la API y Google Client ID).

4. **Levantar el servidor de desarrollo del frontend:**
   ```bash
   npm run dev
   ```
   El frontend estará disponible (generalmente en `http://localhost:5173`).

---

## Tipos de Usuario y Accesos

El sistema contempla dos tipos de usuarios (ambos gestionados mediante el modelo `User`):

1. **Administradores (Back-office):**
   - Tienen acceso a la URL `/admin`.
   - Autenticación manejada mediante el sistema de sesiones de Rails.
   - *Nota: Por motivos de seguridad, las credenciales de administrador no se incluyen en este archivo. Puedes crear un usuario administrador desde la consola de Rails (`rails c`) o mediante el archivo `db/seeds.rb`.*

2. **Usuarios Finales (Frontend/API):**
   - Consumen los endpoints `/api/v1/*`.
   - Autenticación manejada mediante **Token de API** (`api_token`) o integración con Google OAuth.

---

## Modelo de Datos

La aplicación cuenta con las siguientes entidades principales:

- **User:** Representa tanto a los administradores como a los clientes. Almacena credenciales.
- **Category:** Categorías para organizar el catálogo de productos, con soporte para jerarquías (parent_id).
- **Product:** Artículos a la venta. Tienen nombre, precio, stock y una imagen adjunta mediante **Active Storage**.
- **ProductVariant:** Variantes de productos (ej: talle, color).
- **Order:** Representa una compra realizada por un usuario.
- **OrderItem:** El detalle de los productos/variantes adquiridos en una orden específica, almacenando precio unitario y cantidad.

---

## API Endpoints (v1)

La API responde en formato `JSON` y es consumida por la aplicación frontend.

### Públicos
- `POST /api/v1/login` - Iniciar sesión por email y contraseña.
- `POST /api/v1/signup` - Registro de nuevos usuarios.
- `POST /api/v1/auth/google` - Autenticación mediante Google OAuth.
- `GET /api/v1/products` - Lista todos los productos.
- `GET /api/v1/products/:id` - Detalle de un producto.
- `GET /api/v1/categories` - Lista de categorías.

### Protegidos (Requieren Header `Authorization: Bearer <api_token>`)
- `DELETE /api/v1/logout` - Cerrar sesión.
- `GET /api/v1/orders` - Lista el historial de órdenes del usuario.
- `GET /api/v1/orders/:id` - Detalle de una orden.
- `POST /api/v1/orders` - Crear una orden de compra.

---

## Calidad y Pruebas

Este proyecto asegura la calidad del código y la seguridad mediante:
- **Minitest:** Pruebas unitarias para los modelos y de integración para la API (`bin/rails test`).
- **Rubocop:** Verificación de sintaxis y estilo de código Ruby (`bundle exec rubocop`).
- **Brakeman:** Análisis estático de seguridad para prevenir vulnerabilidades (`bundle exec brakeman`).
