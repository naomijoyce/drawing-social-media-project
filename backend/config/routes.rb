Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :drawings
      resources :types, only: [:index,:show, :create]
      resources :categories, only: [:index,:show]
    end
  end
end
