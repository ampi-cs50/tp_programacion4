class OrderMailer < ApplicationMailer
  default from: "no-reply@tp-programacion4.com"

  def confirmation_email
    @order = params[:order]
    @user = @order.user

    mail(to: @user.email_address, subject: "Confirmación de Orden #########{@order.id}")
  end
end
