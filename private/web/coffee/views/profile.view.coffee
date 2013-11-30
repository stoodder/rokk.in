class ProfileView extends Falcon.View
	url: '#profile-tmpl'

	defaults:
		"user": (sc_id) ->
			user = new User
			user.sc_user.set("id", sc_id)
			return user
		#END user
	#END defaults

	observables:
		"current_user": null
		"viewing_user": ->
			if @user.sc_user.isNew()
				return @current_user()
			else
				return @user
			#END if
		#END viewing_user

		"is_loading": false
		"has_error": false
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
		return if current_user.equals( @viewing_user )

		@is_loading( true )

		@user.sc_user.fetch
			complete: => @is_loading( false )
			success: => @has_error( false )
			error: => @has_error( true )
		#END fetchByUsername
	#ENF fetchInformation

	donate: ->
		view = new NewDonationView(@user.sc_user)
		view.on "cancel", -> Application.hideModal()
		Application.showModal( view )
	#END donate
#END ProfileView