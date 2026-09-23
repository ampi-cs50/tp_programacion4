require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  test "should not save category without name" do
    category = Category.new
    assert_not category.save, "Saved category without a name"
  end

  test "should save category with valid name" do
    category = Category.new(name: "Test Category")
    assert category.save, "Failed to save valid category"
  end
end
