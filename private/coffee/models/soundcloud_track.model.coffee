class SC_Track extends SoundCloudModel
	url: "tracks"

	_currently_playing_track = null
	@stopCurrent = ->
		return unless _currently_playing_track instanceof SC_Track
		_currently_playing_track.stop()
		_currently_playing_track = null
	#END stopCurrent

	@setCurrentlyPlaying = (track) ->
		@stopCurrent()
		return unless track instanceof SC_Track
		_currently_playing_track = track
	#END setCurrentPlaying


	"is_playing": false
	"sound": null

	defaults:
		"created_at": null
		"title": ""
		"permalink_url": ""
		"sharing": ""
		"embeddable_by": ""
		"purchase_url": ""
		"artwork_url": ""
		"description": ""
		"duration": 0
		"genre": ""
		"shared_to_count": 0
		"release": 0
		"release_day": 0
		"release_month": 0
		"release_year": 0
		"streamable": false
		"downloadable": false
		"state": ""
		"license": ""
		"track_type": ""
		"waveform_url": ""
		"download_url": ""
		"stream_url": ""
		"video_url": ""
		"bpm": 0
		"commentable": false
		"isrc": ""
		"key_signature": ""
		"comment_count": 0
		"download_count": 0
		"playback_count": 0
		"favoritings_count": 0
		"original_format": ""
		"original_content_size": 0
		"user_favorite": false

		"user": -> new SC_User
		"label": -> new SC_User
		"created_with": -> new SC_Application
		
		"comments": -> new SC_Comments( @ )
		"favorites": -> new SC_Users( @ )
		"shared_to": ->
			shared_to = new SC_Users( @ )
			shared_to.url = "shared-to/users"
			return shared_to
		#END share_to
	#END defaults

	observables:
		"is_playing": false

	togglePlay: -> if @is_playing then @stop() else @play

	play: ->
		return if @is_playing()
		return @sound.play() if @sound

		SC.stream "/tracks/#{@get('id')}", (sound, error) =>
			console.log( error )
			SC_Track.setCurrentlyPlaying(@)
			@sound = sound
			@sound.play()
			@is_playing(true)
		#END stream
	#END stream

	stop: ->
		return unless @is_playing()
		@sound.stop()
		@is_playing(false)
	#END stop
#END SC_Track