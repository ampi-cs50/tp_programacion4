module Admin
  class ProductVariantsController < BaseController
    before_action :set_product
    before_action :set_variant, only: %i[edit update destroy]

    def new
      @variant = @product.product_variants.new(hex_color: "#000000")
    end

    def create
      @variant = @product.product_variants.new(variant_params)
      if @variant.save
        redirect_to admin_product_path(@product), notice: "Variante agregada correctamente."
      else
        render :new, status: :unprocessable_entity
      end
    end

    def edit
    end

    def update
      if @variant.update(variant_params)
        redirect_to admin_product_path(@product), notice: "Variante actualizada."
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      @variant.destroy
      redirect_to admin_product_path(@product), notice: "Variante eliminada."
    end

    private

    def set_product
      @product = Product.find(params[:product_id])
    end

    def set_variant
      @variant = @product.product_variants.find(params[:id])
    end

    def variant_params
      params.require(:product_variant).permit(:color, :hex_color, :size, :stock, :sku)
    end
  end
end
