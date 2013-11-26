Sequel.migration do
  up do
  	add_column :users, :balance_amount, Float
  	add_column :users, :bank_account_uri, Float
  end

  down do
  	drop_column :users, :balance_amount
  	drop_column :users, :bank_account_uri
  end
end
