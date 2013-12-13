Depot2::Application.routes.draw do
  resources :devices
  root 'devices#index'
end
