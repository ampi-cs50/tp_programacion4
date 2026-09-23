require "test_helper"

class OrderMailerTest < ActionMailer::TestCase
  test "confirmation_email" do
    order = Order.new(id: 1, user: User.new(email_address: 'test@example.com'))
    mail = OrderMailer.with(order: order).confirmation_email
    assert_equal "Confirmación de Orden #########{order.id}", mail.subject
    assert_equal [ "test@example.com" ], mail.to
    assert_equal [ "no-reply@tp-programacion4.com" ], mail.from
    assert_match "Total:", mail.body.encoded
  end
end
