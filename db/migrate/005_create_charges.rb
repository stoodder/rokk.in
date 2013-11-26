Sequel.migration do
  up do
    create_table :charges do
      primary_key :id

      Float :credit_card_fee
      Float :payout_amount
      String :balanced_debit_uri

      DateTime :created_at
      DateTime :updated_at

      foreign_key :donation_id, :donations
    end
  end

  down do
    drop_table :charges
  end
end
