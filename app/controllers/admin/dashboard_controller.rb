module Admin
  class DashboardController < BaseController
    def index
      @products_count = Product.count
      @orders_count = Order.count
      @categories_count = Category.count
    end
  end
end
