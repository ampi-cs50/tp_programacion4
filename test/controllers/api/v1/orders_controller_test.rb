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

  test "should create order with product variant and link variant to order item" do
    variant = @product.product_variants.create!(
      color: "Negro",
      size: "M",
      sku: "PROD-BLK-M",
      stock: 5
    )

    assert_difference("OrderItem.count", 1) do
      post api_v1_orders_url,
           params: { order_items: [ { product_id: @product.id, variant_id: variant.id, quantity: 2 } ] },
           headers: { "Authorization" => "Bearer #{@token}" },
           as: :json
    end

    assert_response :created
    json_response = JSON.parse(response.body)
    assert_equal 100.0, json_response["total"].to_f
    assert_equal variant.id, json_response["items"].first["variant_id"]
    assert_equal "Negro", json_response["items"].first["variant_color"]
    assert_equal "M", json_response["items"].first["variant_size"]

    assert_equal 3, variant.reload.stock
    order_item = OrderItem.last
    assert_equal variant, order_item.product_variant
  end

  test "should rollback order if variant stock is insufficient" do
    variant = @product.product_variants.create!(
      color: "Blanco",
      size: "S",
      sku: "PROD-WHT-S",
      stock: 1
    )

    assert_no_difference("Order.count") do
      post api_v1_orders_url,
           params: { order_items: [ { product_id: @product.id, variant_id: variant.id, quantity: 3 } ] },
           headers: { "Authorization" => "Bearer #{@token}" },
           as: :json
    end

    assert_response :unprocessable_entity
    json_response = JSON.parse(response.body)
    assert_match(/Not enough stock/, json_response["error"])
    assert_equal 1, variant.reload.stock
  end
end
