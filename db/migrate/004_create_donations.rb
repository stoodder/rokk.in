Sequel.migration do
  up do
    create_table :donations do
      primary_key :id

      Integer :soundcloud_user_id
      Float :amount
      String :frequency
      String :message
      TrueClass :is_active, :default => true
      TrueClass :is_anonymous, :default => false

      DateTime :created_at
      DateTime :updated_at

      foreign_key :from_user_id, :users
      foreign_key :to_user_id, :users, :null => true

      index :soundcloud_user_id
    end
  end

  down do
    drop_table :donations
  end
end
