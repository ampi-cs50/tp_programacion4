module Api
  module V1
    class RegistrationsController < Api::V1::BaseController
      skip_before_action :require_api_authentication, only: %i[create]

      def create
        user = User.new(
          email_address: params[:email_address],
          password: params[:password],
          password_confirmation: params[:password] # Asumimos que es igual por simplicidad en este TP
        )

        if user.save
          render json: {
            message: "Account created successfully",
            api_token: user.api_token
          }, status: :created
        else
          render json: { error: user.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      end
    end
  end
end
