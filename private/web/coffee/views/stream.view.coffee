class StreamView extends Falcon.View
	url: "#stream-tmpl"

	defaults:
		"tracks": -> new SC_Tracks
	#END defaults

	observables:
		"is_loading": false
		"current_user": null
	#END observables

	display: ->
		Application.on("update:user", @updateCurrentUser, @)
		@updateCurrentUser( Application.current_user() )
	#END display

	dispose: ->
		Application.off("update:user", @updateCurrentUser)
	#END dispose

	updateCurrentUser: (user) ->
		return if user is @current_user()
		@current_user( user )
		@fetchInformation()
	#END updateCurrentUser

	fetchInformation: ->
		return unless ( current_user = @current_user() ) instanceof User
		return if @is_loading()

		@is_loading( true )
		current_user.sc_user.activities.fetchTracks
			complete: => @is_loading( false )
		#END fetchTracks
	#END fetchInformation
#END StreamView