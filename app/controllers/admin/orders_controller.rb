module Admin
  class OrdersController < BaseController
    def index
      @orders = Order.includes(:user).order(created_at: :desc)
    end

    def show
      @order = Order.includes(order_items: :product).find(params[:id])
    end

    def update
      @order = Order.find(params[:id])
      if @order.update(status: params[:order][:status])
        redirect_to admin_order_path(@order), notice: "Estado de la orden actualizado."
      else
        redirect_to admin_order_path(@order), alert: "No se pudo actualizar el estado."
      end
    end
  end
end
