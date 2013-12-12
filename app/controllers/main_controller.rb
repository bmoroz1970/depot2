class MainController < ApplicationController
  def index
  	 @devices = Device.all
  end
end
