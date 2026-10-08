module Admin
  class ProductsController < BaseController
    before_action :set_product, only: %i[show edit update destroy]

    def index
      @products = Product.includes(:category).all
    end

    def show; end

    def new
      @product = Product.new(category_id: params[:category_id])
    end

    def create
      @product = Product.new(product_params)
      if @product.save
        redirect_to admin_product_path(@product), notice: "Producto creado exitosamente."
      else
        render :new, status: :unprocessable_entity
      end
    end

    def edit; end

    def update
      if @product.update(product_params)
        redirect_to admin_product_path(@product), notice: "Producto actualizado."
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      @product.destroy
      redirect_to admin_products_path, notice: "Producto eliminado."
    end

    private

    def set_product
      @product = Product.find(params[:id])
    end

    def product_params
      # Evitar que Rails borre las imágenes si el campo de archivo viene vacío ([""])
      p = params.require(:product).permit(:name, :description, :price, :stock, :category_id, images: [])
      if p[:images] == [ "" ] || p[:images].blank?
        p.delete(:images)
      end
      p
    end
  end
end
