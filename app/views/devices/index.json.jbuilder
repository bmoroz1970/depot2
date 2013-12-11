json.array!(@devices) do |device|
  json.extract! device, :name, :version, :model, :serial_number, :user, :taken
  json.url device_url(device, format: :json)
end
