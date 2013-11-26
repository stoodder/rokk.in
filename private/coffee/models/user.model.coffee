class User extends Falcon.Model
	url: "user"

	defaults:
		"soundcloud_access_token": ""
		"soundcloud_id": ""
		
		"balanced_card_uri": ""
		"balanced_customer_uri": ""
		"balanced_bank_account_uri": ""

		"card_last_4": ""
		"card_type": ""
		"card_expiration_month": 0
		"card_expiration_year": 0

		"bank_name": ""
		"bank_account_number": ""

		"full_name": ""
		"avatar_url": ""

		"created_at": null
		"updated_at": null

		"sc_user": -> new SC_User
	#END defaults
#END User