object @user
attributes :id, :full_name, :avatar_url, :soundcloud_id, :created_at, :updated_at

if @show_full_user
	attributes :balanced_customer_uri, :balanced_card_uri, :balanced_bank_account_uri, :card_last_4, :card_type, :card_expiration_month, :card_expiration_year, :bank_name, :bank_account_number
end