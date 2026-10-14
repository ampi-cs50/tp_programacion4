module Api
  module V1
    class OrdersController < Api::V1::BaseController
      class OrderProcessingError < StandardError; end

      def index
        @orders = current_user.orders.includes(order_items: [ :product, :product_variant ])
        render json: @orders.map { |order| serialize_order(order) }
      end

      def show
        @order = current_user.orders.includes(order_items: [ :product, :product_variant ]).find(params[:id])
        render json: serialize_order(@order)
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Order not found" }, status: :not_found
      end

      def create
        ActiveRecord::Base.transaction do
          @order = current_user.orders.build(status: "pending", total: 0)

          if params[:order_items].blank?
            render json: { error: "Order must contain items" }, status: :unprocessable_entity
            return
          end

          total = 0
          params[:order_items].each do |item_params|
            product = Product.find(item_params[:product_id])
            quantity = item_params[:quantity].to_i
            variant = nil

            if item_params[:variant_id].present?
              variant = product.product_variants.find(item_params[:variant_id])
              if variant.stock < quantity
                raise OrderProcessingError, "Not enough stock for #{product.name} in that color/size"
              end
              variant.update!(stock: variant.stock - quantity)
            else
              if product.stock < quantity
                raise OrderProcessingError, "Not enough stock for #{product.name}"
              end
              product.update!(stock: product.stock - quantity)
            end

            unit_price = product.price
            total += unit_price * quantity
            @order.order_items.build(
              product: product,
              product_variant: variant,
              quantity: quantity,
              unit_price: unit_price
            )
          end

          @order.total = total

          if @order.save
            OrderMailer.with(order: @order).confirmation_email.deliver_later

            render json: serialize_order(@order), status: :created
          else
            render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
            raise ActiveRecord::Rollback
          end
        end
      rescue OrderProcessingError => e
        render json: { error: e.message }, status: :unprocessable_entity
      rescue ActiveRecord::RecordNotFound
        render json: { error: "One or more products or variants not found" }, status: :not_found
      end

      private

      def serialize_order(order)
        {
          id: order.id,
          total: order.total,
          status: order.status,
          created_at: order.created_at,
          items: order.order_items.map do |item|
            {
              product_id: item.product_id,
              product_name: item.product.name,
              variant_id: item.product_variant_id,
              variant_color: item.product_variant&.color,
              variant_size: item.product_variant&.size,
              quantity: item.quantity,
              unit_price: item.unit_price,
              subtotal: item.quantity * item.unit_price
            }
          end
        }
      end
    end
  end
end
