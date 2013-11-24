class SC_Activities extends SoundCloudCollection
	model: SC_Activity

	parse: (data) ->
		return ( SC_Activity::parse(item) for item in (data.collection ? []) )
	#END parse

	fetchTracks: (args...)->
		original_url = @url
		@url = "activities/tracks"
		ret = @fetch(args...)
		@url = original_url
		return ret
	#END fetchtracks
#END SC_Activities