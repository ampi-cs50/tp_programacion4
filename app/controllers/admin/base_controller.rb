module Admin
  class BaseController < ApplicationController
    before_action :require_authentication
    before_action :ensure_admin!

    layout "admin"

    private

    def ensure_admin!
      redirect_to root_path, alert: "Acceso no autorizado" unless Current.user&.admin?
    end
  end
end
