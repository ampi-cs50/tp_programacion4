# Explicación de Archivos Core en Ruby on Rails

Este documento contiene la explicación de tres archivos fundamentales en una aplicación Ruby on Rails, basándose en la estructura del proyecto actual.

---

## 1. Archivo `db/schema.rb` (La Estructura de la Base de Datos)

El archivo `db/schema.rb` es un archivo autogenerado por Rails. Representa el estado actual de tu base de datos utilizando sintaxis de Ruby (específicamente de ActiveRecord) en lugar de usar SQL puro. Su propósito es permitir a Rails crear la base de datos desde cero rápidamente sin tener que ejecutar el historial completo de migraciones.

### ¿Qué es una Migración?
Una migración es como un **sistema de control de versiones para tu base de datos**. En lugar de escribir SQL, escribes código Ruby en archivos de migración (ubicados en `db/migrate/`) para describir cambios (crear tablas, agregar columnas).
*   **Agnóstico de DB:** Escribes Ruby, y Rails lo traduce a tu motor SQL (Postgres, MySQL, SQLite).
*   **Reversible:** Puedes ir hacia adelante o revertir los cambios fácilmente.
*   **Flujo:** Generas la migración -> Corres `bin/rails db:migrate` -> Rails actualiza la base de datos y automáticamente reescribe el archivo `schema.rb` para reflejar el nuevo estado.

### Sintaxis Principal:
*   `ActiveRecord::Schema[8.1].define(version: ...)`: Indica la versión de ActiveRecord y el "timestamp" de la última migración corrida.
*   `create_table "nombre"`: Define una tabla.
*   `t.string`, `t.integer`, `t.datetime`: Definen las columnas y sus tipos de datos.
*   `t.index`: Crea índices para acelerar búsquedas o forzar unicidad (ej. correos únicos).
*   `add_foreign_key`: Establece relaciones obligatorias entre tablas protegiendo la integridad de los datos.

**Regla de oro:** Nunca edites este archivo manualmente. Usa siempre migraciones.

---

## 2. Archivo `config/routes.rb` (El Enrutador)

Este archivo es el **"recepcionista" o "mapa"** de la aplicación. Es el único lugar donde se define qué sucede cuando un usuario o sistema hace una petición HTTP a una URL específica. Conecta la petición entrante (Verbo HTTP + URL) con un Controlador y una Acción específicos.

### Sintaxis Principal:
*   `root "home#index"`: Define la página principal de la aplicación.
*   `namespace :admin`: Agrupa rutas bajo un prefijo en la URL (ej. `/admin/...`) y busca los controladores en una subcarpeta.
*   `resources :categories`: "Magia" de Rails. Genera automáticamente las 7 rutas RESTful estándar para un CRUD completo (index, new, create, show, edit, update, destroy).
*   `only: %i[...]`: Restringe un `resources` para que solo cree las rutas especificadas, evitando exponer acciones no deseadas.
*   `post "login", to: "sessions#create"`: Crea una ruta manual personalizada conectando directamente un método HTTP y una URL con un controlador.

---

## 3. Archivo `orders_controller.rb` (El Controlador de la API)

Los Controladores son los intermediarios (como el mozo de un restaurante) en el patrón Modelo-Vista-Controlador. Reciben la petición que les manda el Router, le piden los datos al Modelo (base de datos) y se los entregan a la Vista (o en este caso, al cliente externo en formato JSON).

### ¿Qué es una API?
Una API es una interfaz para que los sistemas de software se comuniquen entre sí. En lugar de devolver páginas web visuales (HTML/CSS), un controlador de API devuelve **datos puros**, usualmente estructurados en formato **JSON**.

### Explicación del Código:
*   **Herencia (`< Api::V1::BaseController`)**: Indica que hereda la seguridad (autenticación) del controlador base. Asegura que existe un `current_user`.
*   **`index` y `show`**: Buscan todas las órdenes (o una en específico) asegurándose que pertenezcan única y exclusivamente al `current_user`. Luego las transforman a formato JSON.
*   **`create` (Lógica de Compra)**:
    *   Usa `ActiveRecord::Base.transaction do ...`: Agrupa las acciones en bloque. Si falta stock de algún producto a mitad del proceso, hace un "Rollback" (cancela toda la operación para mantener los datos consistentes).
    *   Itera sobre los ítems del JSON recibido, verifica stock, descuenta el stock de cada producto y calcula los subtotales.
    *   Si la orden se guarda (`@order.save`), usa `OrderMailer.with(...).deliver_later` para enviar un correo de confirmación de forma asíncrona (sin bloquear a la API).
    *   Si todo sale bien, devuelve un código HTTP 201 (Created) y el JSON de la orden.
*   **`serialize_order` (Método Privado)**: Toma el objeto complejo de la base de datos de Rails y lo convierte en un diccionario limpio (Hash) con solo los datos necesarios, listo para ser transformado a JSON y enviado al cliente externo.
