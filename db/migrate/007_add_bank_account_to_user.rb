Sequel.migration do
  up do
  	add_column :users, :balance_amount, Float, :default => 0
  	add_column :users, :balanced_bank_account_uri, String
  	add_column :users, :bank_name, String
  	add_column :users, :bank_account_number, String
  end

  down do
  	drop_column :users, :balance_amount
  	drop_column :users, :balanced_bank_account_uri
  	drop_column :users, :bank_name
  	drop_column :users, :bank_account_number
  end
end
