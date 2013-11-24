class SC_Activity extends SoundCloudModel
	url: "activities"

	defaults:
		'tags': ''
		'type': ''
		'created_at': null

		'track': -> new SC_Track
		'playlist': -> new SC_Playlist
		'user': -> new SC_User
	#END defaults 

	parse: (data) ->
		ret =
			'created_at': data['created_at']
			'tags': data['tags']
			'type': data['type']
		#END ret

		if data.type is 'track'
			ret['track'] = data['origin']

		else if data.type is 'playlist'
			ret['playlist'] = data['origin']

		else if data.type is 'favoriting'
			ret['user'] = data['origin']['user']
			ret['track'] = data['origin']['track']
		#END if

		return ret
	#END parse
#END SoundCloud_Activity