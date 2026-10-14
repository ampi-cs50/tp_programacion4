module Api
  module V1
    class SessionsController < Api::V1::BaseController
      skip_before_action :require_api_authentication, only: %i[create google]

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

      def google
        validator = GoogleIDToken::Validator.new
        begin
          payload = validator.check(params[:credential], ENV["GOOGLE_CLIENT_ID"])
          email = payload["email"]

          user = User.find_or_create_by(email_address: email) do |u|
            u.password = SecureRandom.hex(16)
          end

          render json: {
            message: "Google login successful",
            api_token: user.api_token
          }, status: :ok
        rescue GoogleIDToken::ValidationError => e
          render json: { error: "Invalid Google Token: #{e.message}" }, status: :unauthorized
        end
      end

      def destroy
        render json: { message: "Logout successful" }, status: :ok
      end
    end
  end
end
