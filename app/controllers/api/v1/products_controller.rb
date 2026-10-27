module Api
  module V1
    class ProductsController < Api::V1::BaseController
      skip_before_action :require_api_authentication, only: %i[index show]

      def index
        @products = Product.includes(:category, :product_variants, images_attachments: :blob)

        if params[:category_id].present?
          cat = Category.find_by(id: params[:category_id])
          if cat
            cat_ids = [ cat.id ] + cat.subcategories.pluck(:id)
            @products = @products.where(category_id: cat_ids)
          end
        elsif params[:category].present?
          cat = Category.where("LOWER(name) = ?", params[:category].downcase.strip).first
          if cat
            cat_ids = [ cat.id ] + cat.subcategories.pluck(:id)
            @products = @products.where(category_id: cat_ids)
          end
        end

        if params[:search].present?
          query = "%#{params[:search].downcase.strip}%"
          @products = @products.where("LOWER(name) LIKE ? OR LOWER(description) LIKE ?", query, query)
        end

        case params[:sort]
        when "price_asc"
          @products = @products.order(price: :asc)
        when "price_desc"
          @products = @products.order(price: :desc)
        else
          @products = @products.order(created_at: :desc)
        end

        render json: @products.map { |product| serialize_product(product) }
      end

      def show
        @product = Product.includes(:category, :product_variants, images_attachments: :blob).find(params[:id])
        render json: serialize_product(@product)
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Product not found" }, status: :not_found
      end

      private

      def serialize_product(product)
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.product_variants.sum(:stock),
          category_id: product.category_id,
          category: product.category ? {
            id: product.category.id,
            name: product.category.name,
            parent_id: product.category.parent_id,
            parent_name: product.category.parent&.name
          } : nil,
          image_url: (product.images.attached? ? Rails.application.routes.url_helpers.rails_blob_url(product.images.first, host: request.base_url) : nil),
          image_file: (product.images.attached? ? product.images.first.blob.filename.to_s : nil),
          variants: product.product_variants.map do |v|
            {
              id: v.id,
              color: v.color,
              hex_color: v.hex_color || "#000000",
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
