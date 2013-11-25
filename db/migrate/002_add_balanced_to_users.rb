Sequel.migration do
  up do
  	add_column :users, :balanced_customer_uri, String
  end

  down do
  	drop_column :users, :balanced_customer_uri
  end
end
