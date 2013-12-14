Depot2::Application.routes.draw do
  resources :devices do 
  	get :qrcode, on: :member
  end
  root 'devices#index'
end
