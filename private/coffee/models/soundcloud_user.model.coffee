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
		
		"followers": -> 
			followers = new SC_Users( @ )
			followers.url = "followers"
			return followers
		#END followers
		
		"followings": ->
			followings = new SC_Users( @ )
			followings.url = "followings"
			return followings
		#END followings
		
		"comments": -> new SC_Comments( @ )
		
		"favorites": ->
			favorites = new SC_Tracks( @ )
			favorites.url = "favorites"
			return favorites
		#END favorites
		
		"groups": -> new SC_Groups( @ )
		"web-profiles": -> new SC_WebProfiles( @ )
	#END defaults
#END SC_User