Sequel.migration do
  up do
  	add_column :users, :balanced_card_uri, String
  	add_column :users, :card_last_4, String
  	add_column :users, :card_type, String
    add_column :users, :card_expiration_month, Integer
    add_column :users, :card_expiration_year, Integer
  end

  down do
  	drop_column :users, :balanced_card_uri
  	drop_column :users, :card_last_4
  	drop_column :users, :card_type
    drop_column :users, :card_expiration_month
    drop_column :users, :card_expiration_year
  end
end
