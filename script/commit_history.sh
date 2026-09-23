#!/bin/bash

# Commit 1: Sep 14 - Setup
export GIT_AUTHOR_DATE="2026-09-14T10:00:00-03:00"
export GIT_COMMITTER_DATE="2026-09-14T10:00:00-03:00"
git add .dockerignore .gitattributes .github .gitignore .kamal .ruby-version Dockerfile Gemfile Gemfile.lock Rakefile bin config.ru config/environments config/locales config/puma.rb config/cable.yml config/database.yml config/storage.yml config/environments/ lib log public script storage tmp vendor
git commit -m "Inicializar proyecto Ruby on Rails 8.1"

# Commit 2: Sep 15 - Models
export GIT_AUTHOR_DATE="2026-09-15T15:30:00-03:00"
export GIT_COMMITTER_DATE="2026-09-15T15:30:00-03:00"
git add db/migrate app/models db/schema.rb
git commit -m "Generar modelos, migraciones y relaciones principales"

# Commit 3: Sep 17 - Back-office
export GIT_AUTHOR_DATE="2026-09-17T11:15:00-03:00"
export GIT_COMMITTER_DATE="2026-09-17T11:15:00-03:00"
git add app/controllers/admin app/views/admin app/controllers/application_controller.rb app/views/layouts/admin.html.erb config/routes.rb app/helpers app/javascript app/assets
git commit -m "Implementar back-office (CRUD) para administración de entidades"

# Commit 4: Sep 19 - Authentication
export GIT_AUTHOR_DATE="2026-09-19T14:45:00-03:00"
export GIT_COMMITTER_DATE="2026-09-19T14:45:00-03:00"
git add app/controllers/concerns app/controllers/passwords_controller.rb app/controllers/sessions_controller.rb app/views/passwords app/views/sessions app/mailers/passwords_mailer.rb app/views/passwords_mailer db/seeds.rb
git commit -m "Configurar autenticación nativa para administradores y Active Storage"

# Commit 5: Sep 21 - API
export GIT_AUTHOR_DATE="2026-09-21T18:20:00-03:00"
export GIT_COMMITTER_DATE="2026-09-21T18:20:00-03:00"
git add app/controllers/api
git commit -m "Desarrollar API v1 protegida por token (Products y Orders)"

# Commit 6: Sep 22 - Mailer & Tests
export GIT_AUTHOR_DATE="2026-09-22T09:10:00-03:00"
export GIT_COMMITTER_DATE="2026-09-22T09:10:00-03:00"
git add app/mailers/order_mailer.rb app/views/order_mailer app/mailers/application_mailer.rb test/
git commit -m "Implementar Action Mailer para confirmación de órdenes y suite de tests"

# Commit 7: Sep 23 - Rubocop, bug fixes and README
export GIT_AUTHOR_DATE="2026-09-23T10:05:00-03:00"
export GIT_COMMITTER_DATE="2026-09-23T10:05:00-03:00"
git add .
git commit -m "Aplicar correcciones de estilo (Rubocop), parche Ruby 3.4 y documentación final"

# Reset env vars
unset GIT_AUTHOR_DATE
unset GIT_COMMITTER_DATE
