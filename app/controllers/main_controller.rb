class MainController < ApplicationController

  def index
  	 @devices = Device.all
  end

  def reserve(device)
  	#print"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!PUT!!!!!!!!!!!"
  	if device.active?
        puts "Reserve"
    else
        puts "Reserved"
   end
  end

  def disable_with

  end 
  def button_tag(type: 'button') do
   content_tag(:strong, 'Ask me!')
 end
end
