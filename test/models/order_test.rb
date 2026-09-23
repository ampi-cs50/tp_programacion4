require "test_helper"

class OrderTest < ActiveSupport::TestCase
  test "should not save order without user" do
    order = Order.new(status: "pending", total: 100)
    assert_not order.save, "Saved order without a user"
  end

  test "should not save order with negative total" do
    user = User.create!(email_address: "order@example.com", password: "123")
    order = Order.new(status: "pending", total: -10, user: user)
    assert_not order.save, "Saved order with negative total"
  end
end
