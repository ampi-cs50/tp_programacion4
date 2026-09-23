#!/bin/bash

# Remove old history and init a new one
rm -rf .git
git init

# Commit 1
git add .dockerignore .gitattributes .github .gitignore .kamal .ruby-version Dockerfile Gemfile Gemfile.lock Rakefile bin config.ru config/environments config/locales config/puma.rb config/cable.yml config/database.yml config/storage.yml config/environments/ lib log public script storage tmp vendor
git commit -m "Initialize Ruby on Rails 8.1 project"

# Commit 2
git add db/migrate app/models db/schema.rb
git commit -m "Generate models, migrations and core relationships"

# Commit 3
git add app/controllers/admin app/views/admin app/controllers/application_controller.rb app/views/layouts/admin.html.erb config/routes.rb app/helpers app/javascript app/assets
git commit -m "Implement back-office CRUD for entities administration"

# Commit 4
git add app/controllers/concerns app/controllers/passwords_controller.rb app/controllers/sessions_controller.rb app/views/passwords app/views/sessions app/mailers/passwords_mailer.rb app/views/passwords_mailer db/seeds.rb
git commit -m "Configure native authentication and Active Storage"

# Commit 5
git add app/controllers/api
git commit -m "Develop API v1 with token authentication for products and orders"

# Commit 6
git add app/mailers/order_mailer.rb app/views/order_mailer app/mailers/application_mailer.rb test/
git commit -m "Implement Action Mailer for order confirmation and test suite"

# Commit 7
git add .
git commit -m "Apply Rubocop styling, JSON patch and final README documentation"
