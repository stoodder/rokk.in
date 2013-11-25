class User extends Falcon.Model
	url: "user"

	defaults:
		"soundcloud_access_token": ""
		"soundcloud_id": ""
		
		"balanced_card_uri": ""
		"balanced_customer_uri": ""

		"full_name": ""
		"avatar_url": ""

		"created_at": null
		"updated_at": null

		"sc_user": -> new SC_User
	#END defaults
#END User