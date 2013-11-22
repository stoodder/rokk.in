class DashboardView extends Falcon.View
	url: "#dashboard-tmpl"

	observables:
		"current_user": null
		"is_loading_followings": false
	#END observables

	initialize: ->
		Application.on("update:user", @updateCurrentUser, @)
	#END initialize

	dispose: ->
		Application.off("update:user", @updateCurrentUser)
	#END dispose

	filtered_followings: ->
		return [] unless ( current_user = @current_user() ) instanceof User
		chain = current_user.sc_user.followings.chain()

		chain.remove (user) -> user.get("plan").toLowerCase() is "free"
		chain.remove (user) -> _.isEmpty( user.get("full_name") )
		chain.remove (user) -> user.get('track_count') <= 0

		models = chain.models()

		return _.sortBy( models, (user) -> _.trim( user.get("full_name") ).toLowerCase() )

	#END filtered_followings

	updateCurrentUser: (user) ->
		return if user is @current_user()
		@current_user( user )
		@fetchInformation()
	#END updateCurrentUser

	fetchInformation: ->
		return unless ( current_user = @current_user() ) instanceof User
		return if @is_loading_followings()

		@is_loading_followings( true )

		current_user.sc_user.followings.fetch
			params: {'limit': 100000}
			complete: => @is_loading_followings( false )
	#END fetchInformation
#END DashboardView