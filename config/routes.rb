Rails.application.routes.draw do
  root "home#index"

  # Rutas de autenticación generadas por Rails 8
  resource :session
  resources :passwords, param: :token

  # Back-office protegido
  namespace :admin do
    root to: "dashboard#index"
    resources :categories
    resources :products
    resources :orders, only: %i[index show update]
  end

  # API
  namespace :api do
    namespace :v1 do
      post "login", to: "sessions#create"
      delete "logout", to: "sessions#destroy"

      resources :products, only: %i[index show]
      resources :orders, only: %i[index show create]
    end
  end
end
