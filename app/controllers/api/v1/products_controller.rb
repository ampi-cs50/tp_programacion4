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
          stock: product.product_variants.sum(:stock), # El stock total es la suma de las variantes
          category_id: product.category_id,
          image_url: (product.images.attached? ? Rails.application.routes.url_helpers.rails_blob_url(product.images.first, host: request.base_url) : nil),
          variants: product.product_variants.map do |v|
            {
              id: v.id,
              color: v.color,
              hex_color: v.hex_color || '#000000',
              size: v.size,
              stock: v.stock,
              sku: v.sku
            }
          end
        }
      end
    end
  end
end
