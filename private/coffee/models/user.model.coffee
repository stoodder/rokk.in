class User extends Falcon.Model
	url: "user"

	defaults:
		"soundcloud_access_token": ""
		"full_name": ""
		"soundcloud_id": ""
		"avatar_url": ""

		"created_at": null
		"updated_at": null

		"sc_user": -> new SC_User
	#END defaults
#END User