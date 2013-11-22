class SplashView extends Falcon.View
	url: '#splash-tmpl'

	observables:
		"is_loading": false
		"is_connected": false
	#END observables

	connect: ->
		return if @is_loading()
		@is_loading( true )
		@is_connected( false )

		#TODO: Add handling to the UI for connection_request.abort (which is returned from Application.connect)
		Application.connect
			success: (soundcloud_access_token) =>
				@is_connected( true )
				@login( soundcloud_access_token )
			#END success

			error: (error, message) =>
				console.log(error, message)
				@is_loading( false )
			#END error
		#END connect
	#END connect

	login: (soundcloud_access_token) ->
		return unless soundcloud_access_token?
		return unless @is_connected()

		( new Session({soundcloud_access_token}) ).create
			'attributes': ['soundcloud_access_token']
			success: (session) =>
				Application.login( session )
				@is_loading( false )
				@is_connected( false )
			#END success

			error: =>
				@register( soundcloud_access_token )
			#END error
	#END login

	register: (soundcloud_access_token) ->
		return unless soundcloud_access_token?
		return unless @is_connected()
		return if Application.is_logged_in()

		( new User({soundcloud_access_token}) ).create
			'attributes': ['soundcloud_access_token']
			success: (user) ->
				( new Session ).fetch
					success: (session) => Application.login( session )
					complete: =>
						@is_connected( false )
						@is_loading( false )
					#END complete
				#END fetch
			#END success

			error: (user) =>
				@is_loading( false )
				@is_connected( false )
			#END error
	#END register
#END SplashView