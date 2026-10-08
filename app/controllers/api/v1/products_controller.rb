module Api
  module V1
    class ProductsController < Api::V1::BaseController
      skip_before_action :require_api_authentication, only: %i[index show]

      def index
        @products = Product.all
        # Formato de respuesta JSON
        render json: @products.map { |product| serialize_product(product) }
      end

      def show
        @product = Product.find(params[:id])
        render json: serialize_product(@product)
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Product not found" }, status: :not_found
      end

      private

      def serialize_product(product)
        {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          category_id: product.category_id,
          # Si tiene imagen, devolver la URL usando url_for (requiere configuración extra en Active Storage si es full URL,
          # o devolver la ruta para que el frontend la resuelva)
          image_url: (product.images.attached? ? Rails.application.routes.url_helpers.rails_blob_url(product.images.first, host: request.base_url) : nil)
        }
      end
    end
  end
end
