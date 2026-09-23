require "test_helper"

class Api::V1::ProductsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @category = Category.create!(name: "Test")
    @product = Product.create!(name: "API Product", price: 99.99, stock: 10, category: @category)
  end

  test "should get index" do
    get api_v1_products_url, as: :json
    assert_response :success
    json_response = JSON.parse(response.body)
    assert_not_empty json_response
  end

  test "should get show" do
    get api_v1_product_url(@product), as: :json
    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal "API Product", json_response["name"]
  end
end
