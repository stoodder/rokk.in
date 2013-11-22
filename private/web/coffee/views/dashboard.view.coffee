class DashboardView extends Falcon.View
	url: "#dashboard-tmpl"

	observables:
		"current_user": null
	#END observables

	initialize: ->
		Application.on("update:user", @updateCurrentUser, @)
	#END initialize

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
	#END fetchInformation
#END DashboardView