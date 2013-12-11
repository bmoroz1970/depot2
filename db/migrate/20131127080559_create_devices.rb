class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices do |t|
      t.string :name
      t.string :version
      t.string :model
      t.string :serial_number
      t.string :user
      t.boolean :taken

      t.timestamps
    end
  end
end
