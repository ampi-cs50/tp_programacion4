Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "*" # Para desarrollo. En producción, pon aquí la URL de tu frontend.

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ["Authorization"]
  end
end
