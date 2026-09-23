require "test_helper"

class Api::V1::OrdersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email_address: "api_user@example.com", password: "password")
    @token = @user.api_token
    @category = Category.create!(name: "Test")
    @product = Product.create!(name: "API Product", price: 50.0, stock: 10, category: @category)
  end

  test "should not create order without token" do
    post api_v1_orders_url, params: { order_items: [ { product_id: @product.id, quantity: 1 } ] }, as: :json
    assert_response :unauthorized
  end

  test "should create order with valid token" do
    post api_v1_orders_url,
         params: { order_items: [ { product_id: @product.id, quantity: 1 } ] },
         headers: { "Authorization" => "Bearer #{@token}" },
         as: :json

    assert_response :created
    json_response = JSON.parse(response.body)
    assert_equal 50.0, json_response["total"].to_f
    assert_equal 1, json_response["items"].length
  end
end
