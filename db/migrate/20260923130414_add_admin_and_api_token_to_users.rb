class AddAdminAndApiTokenToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :admin, :boolean
    add_column :users, :api_token, :string
  end
end
