require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "should not save user without email" do
    user = User.new(password: "123456")
    assert_not user.save, "Saved the user without an email"
  end

  test "should not save user with duplicate email" do
    User.create!(email_address: "test@example.com", password: "password")
    duplicate_user = User.new(email_address: "test@example.com", password: "password")
    assert_not duplicate_user.save, "Saved a user with duplicate email"
  end

  test "should generate api token automatically" do
    user = User.create!(email_address: "token@example.com", password: "password")
    assert_not_nil user.api_token, "API token was not generated"
  end
end
