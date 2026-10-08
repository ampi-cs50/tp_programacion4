class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :orders, dependent: :destroy

  has_secure_token :api_token

  normalizes :email_address, with: ->(e) { e.strip.downcase }

  validates :email_address, presence: { message: "El correo no puede estar vacío" },
                            uniqueness: { message: "Este correo ya está registrado" },
                            format: { with: URI::MailTo::EMAIL_REGEXP, message: "El formato del correo es inválido" }
  validates :password, length: { minimum: 6, message: "La contraseña debe tener al menos 6 caracteres" },
                       if: -> { new_record? || !password.nil? }
end
