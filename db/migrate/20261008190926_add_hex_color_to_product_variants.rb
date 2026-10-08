class AddHexColorToProductVariants < ActiveRecord::Migration[8.1]
  def change
    add_column :product_variants, :hex_color, :string
  end
end
