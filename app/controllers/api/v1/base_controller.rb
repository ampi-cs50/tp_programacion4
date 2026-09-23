module Api
  module V1
    class BaseController < ActionController::API
      include ActionController::HttpAuthentication::Token::ControllerMethods
      
      # Se requiere autenticación por defecto en la API
      before_action :require_api_authentication

      private

      def require_api_authentication
        authenticate_or_request_with_http_token do |token, _options|
          @current_user = User.find_by(api_token: token)
        end
      end

      def current_user
        @current_user
      end
    end
  end
end
