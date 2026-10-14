class AddProductVariantToOrderItems < ActiveRecord::Migration[8.1]
  def change
    add_reference :order_items, :product_variant, null: true, foreign_key: true
  end
end
