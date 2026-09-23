module Api
  module V1
    class SessionsController < Api::V1::BaseController
      skip_before_action :require_api_authentication, only: %i[create]

      def create
        user = User.authenticate_by(email_address: params[:email_address], password: params[:password])

        if user
          render json: {
            message: "Login successful",
            api_token: user.api_token
          }, status: :ok
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def destroy
        # Opcionalmente, se podría regenerar el token para invalidarlo:
        # current_user.regenerate_api_token

        render json: { message: "Logout successful" }, status: :ok
      end
    end
  end
end
