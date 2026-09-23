require "test_helper"

class ProductTest < ActiveSupport::TestCase
  test "should not save product without name" do
    product = Product.new(price: 100.0, stock: 10)
    assert_not product.save, "Saved the product without a name"
  end

  test "should save product with valid attributes" do
    category = Category.create!(name: "Electrónica")
    product = Product.new(name: "TV", price: 100.0, stock: 10, category: category)
    assert product.save, "Failed to save the product with valid attributes"
  end

  test "price must be greater than or equal to 0" do
    category = Category.create!(name: "Electrónica")
    product = Product.new(name: "TV", price: -10.0, stock: 10, category: category)
    assert_not product.save, "Saved the product with negative price"
  end
end
