class SC_User extends SoundCloudModel
	url: "users"

	defaults:
		"username": ""
		"permalink_url": ""
		"avatar_url": ""
		"country": ""
		"full_name": ""
		"city": ""
		"description": ""
		"website": ""
		"website_title": ""
		"track_count": 0
		"playlist_count": 0
		"followers_count": 0
		"followings_count": 0
		"public_favorites_count": 0

		"tracks": -> new SC_Tracks( @ )
		"playlists": -> new SC_Playlists( @ )
		"followers": -> new SC_Users( @ )
		"followings": -> new SC_Users( @ )
		"comments": -> new SC_Comments( @ )
		"favorites": -> new SC_Tracks( @ )
		"groups": -> new SC_Groups( @ )
		"web-profiles": -> new SC_WebProfiles( @ )
	#END defaults
#END SC_User