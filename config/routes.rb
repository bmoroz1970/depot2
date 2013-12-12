Depot2::Application.routes.draw do
  resources :devices do
    put :reserve, on: :member
  end
  root 'devices#index'
end
