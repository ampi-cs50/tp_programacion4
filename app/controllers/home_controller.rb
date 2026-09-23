class HomeController < ApplicationController
  skip_before_action :require_authentication, raise: false

  def index
  end
end
