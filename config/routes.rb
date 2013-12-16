Depot2::Application.routes.draw do
  resources :devices do 
  	get :qrcode, on: :member
  	put :update_status_taken, on: :member
  end
  root 'devices#index'
end
