# TP1 Programación IV - E-commerce API & Back-office

Este proyecto es el Trabajo Práctico Nº 1 para la materia Programación IV. Consiste en el desarrollo del backend de una aplicación web de comercio electrónico (Tienda de productos) utilizando **Ruby on Rails 8.1**.

## Objetivo del Sistema
Proveer un sistema robusto que permita a los administradores gestionar el catálogo de productos y visualizar las órdenes, mientras que expone una API JSON segura para que futuros clientes (front-end) puedan consultar el catálogo y realizar compras.

## Instalación y Configuración

Sigue estos pasos para levantar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd tp_programacion4
   ```

2. **Instalar dependencias:**
   Asegúrate de tener Ruby 3.4.10 instalado.
   ```bash
   bundle install
   ```

3. **Preparar la Base de Datos:**
   El proyecto utiliza SQLite en desarrollo.
   ```bash
   bin/rails db:setup
   ```
   *(Nota: `db:setup` creará la base de datos, cargará el esquema y ejecutará el archivo `db/seeds.rb` si tienes datos semilla).*

4. **Levantar el servidor:**
   ```bash
   bin/rails server
   ```

---

## Tipos de Usuario y Accesos

El sistema contempla dos tipos de usuarios (ambos gestionados mediante el modelo `User`):

1. **Administradores (Back-office):**
   - Tienen acceso a la URL `/admin`.
   - Autenticación manejada mediante el sistema de sesiones tradicional de Rails.
   - **Credenciales de prueba:** *(Reemplaza esto con el email/password que uses en tu archivo seeds.rb o los que uses para probar)*
     - **Email:** `admin@admin.com`
     - **Password:** `123456`

2. **Usuarios Finales (API):**
   - Consumen los endpoints `/api/v1/*`.
   - Autenticación manejada mediante un **Token de API** (`api_token`).

---

## Modelo de Datos

La aplicación cuenta con las siguientes entidades principales:

- **User:** Representa tanto a los administradores como a los clientes. Almacena credenciales y el `api_token`.
- **Category:** Categorías para organizar el catálogo de productos.
- **Product:** Artículos a la venta. Tienen nombre, precio, stock y una imagen adjunta mediante **Active Storage**.
- **Order:** Representa una compra realizada por un usuario.
- **OrderItem:** El detalle de los productos adquiridos en una orden específica, almacenando precio unitario y cantidad.

---

## API Endpoints (v1)

La API responde en formato `JSON` y está pensada para ser consumida por el frontend (TP2).

### Públicos
- `POST /api/v1/login`
  - Body: `{ "email_address": "user@test.com", "password": "123" }`
  - Retorna: `{ "message": "...", "api_token": "TOKEN_SECRETO" }`
- `GET /api/v1/products` (Lista todos los productos)
- `GET /api/v1/products/:id` (Detalle de un producto)

### Protegidos (Requieren Header `Authorization: Bearer <api_token>`)
- `GET /api/v1/orders` (Lista el historial de órdenes del usuario)
- `GET /api/v1/orders/:id` (Detalle de una orden)
- `POST /api/v1/orders` (Crear una orden de compra)
  - Body esperado:
    ```json
    {
      "order_items": [
        { "product_id": 1, "quantity": 2 }
      ]
    }
    ```
  - *Al procesarse la orden, el stock se descuenta automáticamente de forma segura mediante una transacción, y se envía un **email de confirmación (Action Mailer)** de manera asíncrona.*

---

## Calidad y Pruebas

Este proyecto asegura la calidad del código y la seguridad mediante:
- **Minitest:** Pruebas unitarias para los modelos y de integración para la API (`bin/rails test`).
- **Rubocop:** Verificación de sintaxis y estilo de código Ruby (`bundle exec rubocop`).
- **Brakeman:** Análisis estático de seguridad para prevenir vulnerabilidades (`bundle exec brakeman`).
