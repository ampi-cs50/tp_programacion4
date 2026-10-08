module Api
  module V1
    class OrdersController < Api::V1::BaseController
      # Se asume que require_api_authentication ya corre por el BaseController

      def index
        @orders = current_user.orders.includes(:order_items)
        render json: @orders.map { |order| serialize_order(order) }
      end

      def show
        @order = current_user.orders.find(params[:id])
        render json: serialize_order(@order)
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Order not found" }, status: :not_found
      end

      def create
        # JSON esperado:
        # {
        #   "order_items": [
        #     { "product_id": 1, "quantity": 2 },
        #     { "product_id": 2, "quantity": 1 }
        #   ]
        # }
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

            if item_params[:variant_id].present?
              variant = ProductVariant.find(item_params[:variant_id])
              if variant.stock < quantity
                raise ActiveRecord::Rollback, "Not enough stock for #{product.name} in that color/size"
              end
              variant.update!(stock: variant.stock - quantity)
            else
              if product.stock < quantity
                raise ActiveRecord::Rollback, "Not enough stock for #{product.name}"
              end
              product.update!(stock: product.stock - quantity)
            end

            unit_price = product.price
            total += unit_price * quantity
            @order.order_items.build(
              product: product,
              quantity: quantity,
              unit_price: unit_price
            )
          end

          @order.total = total

          if @order.save
            # Enviar el email asíncronamente
            OrderMailer.with(order: @order).confirmation_email.deliver_later

            render json: serialize_order(@order), status: :created
          else
            render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
            raise ActiveRecord::Rollback
          end
        end
      rescue ActiveRecord::Rollback => e
        render json: { error: e.message || "Could not process order" }, status: :unprocessable_entity
      rescue ActiveRecord::RecordNotFound
        render json: { error: "One or more products not found" }, status: :not_found
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
