# Contrato de la API REST - Midori's Flow

**Proyecto:** Midori's Flow - E-commerce de Indumentaria Deportiva y Activewear  
**Materia:** Programación IV - Trabajo Práctico N.º 2  
**Modalidad:** Individual  
**Autor:** ampi-cs50  
**Versión de la API:** `v1`  
**Última actualización:** Octubre 2026  

---

## 1. Configuración General

* **URL Base en Desarrollo:** `http://localhost:3000/api/v1` (o mediante proxy de Vite en `http://localhost:5173/api/v1`)
* **Formato de Intercambio:** `application/json`
* **Codificación:** UTF-8
* **Mecanismo de Autenticación:** Token de portador en cabecera HTTP (*Bearer Token*).
  * En peticiones protegidas se debe enviar el encabezado:
    ```http
    Authorization: Bearer <api_token>
    ```
* **Inicio y Cierre de Sesión:**
  * El inicio de sesión devuelve un `api_token` único generado para el usuario.
  * El cierre de sesión (`DELETE /api/v1/logout`) revoca o elimina la sesión activa del token.

---

## 2. Convención de Códigos de Estado HTTP y Errores

| Código HTTP | Significado | Caso de uso |
|---|---|---|
| `200 OK` | Petición exitosa | Consultas (`GET`), actualizaciones (`PUT`/`PATCH`) y eliminación. |
| `201 Created` | Recurso creado con éxito | Registro de usuario (`POST /signup`), creación de órdenes (`POST /orders`). |
| `400 Bad Request` | Petición malformada | Parámetros obligatorios ausentes en el cuerpo JSON. |
| `401 Unauthorized` | No autorizado / Sesión inválida | Token ausente, expirado o credenciales de acceso inválidas. |
| `404 Not Found` | Recurso inexistente | Identificador de producto u orden que no existe en la base de datos. |
| `422 Unprocessable Entity` | Error de validación de negocio | Stock insuficiente para una variante, formato de contraseña débil o email duplicado. |

### Formato estándar de respuesta de error:
```json
{
  "error": "Descripción legible del motivo del error"
}
```
En caso de múltiples errores de validación de modelo:
```json
{
  "errors": [
    "Password es demasiado corta (mínimo 6 caracteres)",
    "Email address ya está en uso"
  ]
}
```

---

## 3. Catálogo de Endpoints

### 3.1. Autenticación y Cuentas

---

#### `POST /signup`
* **Acceso:** Público.
* **Descripción:** Registra un nuevo cliente en el sistema y le asigna un token de sesión de API.
* **Encabezados requeridos:**
  * `Content-Type: application/json`
* **Cuerpo de la petición (JSON):**
  | Campo | Tipo | Requerido | Validaciones / Descripción |
  |---|---|---|---|
  | `email_address` | String | Sí | Formato de email válido (`user@domain.com`). Unicidad en el sistema. |
  | `password` | String | Sí | Longitud mínima de 6 caracteres. |
* **Ejemplo de Petición:**
  ```bash
  curl -X POST http://localhost:3000/api/v1/signup \
    -H "Content-Type: application/json" \
    -d '{
      "email_address": "nuevo.cliente@midorisflow.com",
      "password": "PasswordSegura123!"
    }'
  ```
* **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "api_token": "9f8b2a1c7e4d5f6a8b0c1d2e3f4a5b6c",
    "user": {
      "id": 15,
      "email_address": "nuevo.cliente@midorisflow.com"
    }
  }
  ```
* **Respuestas de Error:**
  * `422 Unprocessable Entity` (Email duplicado o clave corta):
    ```json
    {
      "errors": ["Email address ya está registrado"]
    }
    ```

---

#### `POST /login`
* **Acceso:** Público.
* **Descripción:** Autentica un usuario mediante sus credenciales tradicionales (correo y contraseña).
* **Encabezados requeridos:** `Content-Type: application/json`
* **Cuerpo de la petición (JSON):**
  | Campo | Tipo | Requerido | Descripción |
  |---|---|---|---|
  | `email_address` | String | Sí | Correo electrónico de la cuenta. |
  | `password` | String | Sí | Contraseña en texto plano a verificar por bcrypt. |
* **Ejemplo de Petición:**
  ```bash
  curl -X POST http://localhost:3000/api/v1/login \
    -H "Content-Type: application/json" \
    -d '{
      "email_address": "cliente@midorisflow.com",
      "password": "PasswordSegura123!"
    }'
  ```
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "api_token": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    "user": {
      "id": 12,
      "email_address": "cliente@midorisflow.com"
    }
  }
  ```
* **Respuestas de Error:**
  * `401 Unauthorized` (Credenciales incorrectas):
    ```json
    {
      "error": "Correo o contraseña incorrectos."
    }
    ```

---

#### `POST /auth/google`
* **Acceso:** Público.
* **Descripción:** Autenticación o registro federado mediante Google Identity Services (Google OAuth 2.0).
* **Encabezados requeridos:** `Content-Type: application/json`
* **Cuerpo de la petición (JSON):**
  | Campo | Tipo | Requerido | Descripción |
  |---|---|---|---|
  | `credential` | String | Sí | Token JWT emitido por la ventana oficial de Google Login. |
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "api_token": "g_token_8877665544332211aabbccddeeff",
    "user": {
      "id": 8,
      "email_address": "atleta.google@gmail.com"
    }
  }
  ```
* **Respuestas de Error:**
  * `401 Unauthorized` (JWT manipulado o vencido):
    ```json
    {
      "error": "Token de Google inválido."
    }
    ```

---

#### `DELETE /logout`
* **Acceso:** Protegido (`Bearer Token`).
* **Descripción:** Invalida el token del usuario actual y cierra su sesión de API.
* **Encabezados requeridos:**
  * `Authorization: Bearer <api_token>`
* **Ejemplo de Petición:**
  ```bash
  curl -X DELETE http://localhost:3000/api/v1/logout \
    -H "Authorization: Bearer a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
  ```
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "message": "Sesión cerrada exitosamente."
  }
  ```

---

### 3.2. Catálogo de Productos y Categorías

---

#### `GET /categories`
* **Acceso:** Público.
* **Descripción:** Devuelve la lista jerárquica de categorías principales con sus subcategorías anidadas.
* **Ejemplo de Petición:**
  ```bash
  curl -X GET http://localhost:3000/api/v1/categories
  ```
* **Respuesta Exitosa (`200 OK`):**
  ```json
  [
    {
      "id": 11,
      "name": "Mujer",
      "subcategories": [
        { "id": 25, "name": "Leggings & Calzas" },
        { "id": 26, "name": "Tops & Corpiños" },
        { "id": 27, "name": "Camperas & Buzos" },
        { "id": 28, "name": "Shorts Deportivos" }
      ]
    },
    {
      "id": 10,
      "name": "Hombre",
      "subcategories": [
        { "id": 29, "name": "Pantalones & Joggers" },
        { "id": 30, "name": "Remeras & Musculosas" },
        { "id": 31, "name": "Shorts Deportivos" },
        { "id": 32, "name": "Buzos & Camperas" }
      ]
    },
    {
      "id": 2,
      "name": "Accesorios",
      "subcategories": [
        { "id": 33, "name": "Mats & Yoga" },
        { "id": 34, "name": "Riñoneras & Bolsos" },
        { "id": 35, "name": "Botellas & Complementos" }
      ]
    }
  ]
  ```

---

#### `GET /products`
* **Acceso:** Público.
* **Descripción:** Consulta el listado de productos activos con soporte para filtrado jerárquico, búsqueda por texto y ordenamiento.
* **Parámetros de consulta (Query Params):**
  | Parámetro | Tipo | Requerido | Descripción |
  |---|---|---|---|
  | `category` | String | No | Nombre de la categoría padre o subcategoría (ej: `Hombre`, `Mujer`, `Accesorios`). |
  | `category_id` | Integer | No | ID específico de categoría (incluye recursivamente sus subcategorías). |
  | `search` | String | No | Término de búsqueda aplicado sobre el nombre y la descripción. |
  | `sort` | String | No | Orden de resultados: `price_asc` (menor a mayor), `price_desc` (mayor a menor). Por defecto: más recientes primero. |
* **Ejemplo de Petición:**
  ```bash
  curl -X GET "http://localhost:3000/api/v1/products?category=Mujer&sort=price_asc"
  ```
* **Respuesta Exitosa (`200 OK`):**
  ```json
  [
    {
      "id": 27,
      "name": "Corpiño Deportivo Energy Bra™",
      "description": "Corpiño deportivo multiuso con tiras dobles cruzadas en la espalda...",
      "price": "22000.0",
      "stock": 79,
      "category_id": 26,
      "category": {
        "id": 26,
        "name": "Tops & Corpiños",
        "parent_id": 11,
        "parent_name": "Mujer"
      },
      "image_url": "http://localhost:3000/rails/active_storage/blobs/redirect/.../energy_bra.jpg",
      "image_file": "energy_bra.jpg",
      "variants": [
        {
          "id": 140,
          "color": "Verde Salvia",
          "hex_color": "#708271",
          "size": "S",
          "stock": 12,
          "sku": "ENE-BRA-01-S-GRN"
        },
        {
          "id": 141,
          "color": "Verde Salvia",
          "hex_color": "#708271",
          "size": "M",
          "stock": 15,
          "sku": "ENE-BRA-01-M-GRN"
        }
      ]
    }
  ]
  ```

---

#### `GET /products/:id`
* **Acceso:** Público.
* **Descripción:** Obtiene los datos detallados de un producto individual por su ID numérico.
* **Parámetros de ruta:**
  * `id` (Integer, requerido): ID único del producto.
* **Ejemplo de Petición:**
  ```bash
  curl -X GET http://localhost:3000/api/v1/products/1
  ```
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "id": 1,
    "name": "Leggings Align™ Tiro Alto 25\"",
    "description": "Nuestra prenda insignia para yoga y pilates...",
    "price": "38000.0",
    "stock": 85,
    "category_id": 25,
    "category": {
      "id": 25,
      "name": "Leggings & Calzas",
      "parent_id": 11,
      "parent_name": "Mujer"
    },
    "image_url": "http://localhost:3000/rails/active_storage/blobs/redirect/.../align_leggings.jpg",
    "image_file": "align_leggings.jpg",
    "variants": [
      {
        "id": 133,
        "color": "Negro",
        "hex_color": "#111111",
        "size": "XS",
        "stock": 10,
        "sku": "ALI-LEG-01-XS-BLK"
      }
    ]
  }
  ```
* **Respuestas de Error:**
  * `404 Not Found` (Producto inexistente):
    ```json
    {
      "error": "Product not found"
    }
    ```

---

### 3.3. Órdenes de Compra y Checkout

---

#### `POST /orders`
* **Acceso:** Protegido (`Bearer Token`).
* **Descripción:** Registra una nueva compra en el sistema. Valida stock suficiente para cada variante, persiste la orden y sus ítems, y descuenta el stock atómicamente.
* **Encabezados requeridos:**
  * `Authorization: Bearer <api_token>`
  * `Content-Type: application/json`
* **Cuerpo de la petición (JSON):**
  | Campo | Tipo | Requerido | Descripción |
  |---|---|---|---|
  | `order_items` | Array de Objetos | Sí | Lista de artículos a comprar. |
  | `order_items[].product_id` | Integer | Sí | ID del producto base. |
  | `order_items[].variant_id` | Integer | Sí | ID de la variante específica (talle/color). |
  | `order_items[].quantity` | Integer | Sí | Cantidad de unidades a adquirir (mínimo 1). |
* **Ejemplo de Petición:**
  ```bash
  curl -X POST http://localhost:3000/api/v1/orders \
    -H "Authorization: Bearer a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6" \
    -H "Content-Type: application/json" \
    -d '{
      "order_items": [
        {
          "product_id": 1,
          "variant_id": 133,
          "quantity": 2
        }
      ]
    }'
  ```
* **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "id": 4,
    "user_id": 12,
    "total": "76000.0",
    "status": "completed",
    "created_at": "2026-10-26T22:00:00.000Z",
    "order_items": [
      {
        "id": 7,
        "product_id": 1,
        "product_name": "Leggings Align™ Tiro Alto 25\"",
        "product_variant_id": 133,
        "variant_details": "Negro / XS",
        "quantity": 2,
        "unit_price": "38000.0",
        "subtotal": "76000.0"
      }
    ]
  }
  ```
* **Respuestas de Error:**
  * `401 Unauthorized` (Token faltante o inválido):
    ```json
    {
      "error": "Acceso no autorizado. Inicia sesión para continuar."
    }
    ```
  * `422 Unprocessable Entity` (Stock insuficiente):
    ```json
    {
      "error": "No hay stock suficiente para Leggings Align™ Tiro Alto 25\" (Negro / XS). Stock disponible: 1"
    }
    ```

---

#### `GET /orders`
* **Acceso:** Protegido (`Bearer Token`).
* **Descripción:** Lista todas las compras realizadas históricamente por el usuario autenticado.
* **Encabezados requeridos:**
  * `Authorization: Bearer <api_token>`
* **Respuesta Exitosa (`200 OK`):**
  ```json
  [
    {
      "id": 4,
      "total": "76000.0",
      "status": "completed",
      "created_at": "2026-10-26T22:00:00.000Z",
      "items_count": 2
    }
  ]
  ```

---

#### `GET /orders/:id`
* **Acceso:** Protegido (`Bearer Token`).
* **Descripción:** Devuelve el detalle completo de una orden específica (sólo accesible si pertenece al usuario autenticado).
* **Parámetros de ruta:**
  * `id` (Integer): ID de la orden.
* **Respuestas de Error:**
  * `404 Not Found` si la orden no existe o pertenece a otro usuario.
