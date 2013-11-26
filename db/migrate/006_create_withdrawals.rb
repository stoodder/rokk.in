Sequel.migration do
  up do
    create_table :withdrawals do
      primary_key :id

      Float :payout_amount
      Float :transaction_fee
      String :transaction_number
      String :status
      String :balanced_credit_uri

      DateTime :created_at
      DateTime :updated_at
      
      foreign_key :user_id, :users
    end
  end

  down do
    drop_table :withdrawals
  end
end
