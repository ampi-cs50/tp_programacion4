module Api
  module V1
    class CategoriesController < Api::V1::BaseController
      skip_before_action :require_api_authentication, only: [:index] # Asumiendo que quieres que el catálogo sea público

      def index
        # Traemos solo las categorías "Padre" e incluimos sus subcategorías en la consulta
        @parent_categories = Category.where(parent_id: nil).includes(:subcategories)
        
        render json: @parent_categories.map { |category| 
          {
            id: category.id,
            name: category.name,
            subcategories: category.subcategories.map do |sub|
              {
                id: sub.id,
                name: sub.name
              }
            end
          }
        }
      end
    end
  end
end
