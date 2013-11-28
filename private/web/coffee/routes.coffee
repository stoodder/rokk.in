Finch.route "/",
	setup: ->
		Application.checkSession()
		Finch.observe "query", (query) -> Application.search( query )
	#END setup

	load: ->
		Application.setContentView( new DashboardView )
	#END load
#END /

Finch.route "[/]stream",
	setup: ->
		@view = Application.setContentView( new StreamView )
	#END setup
#END stream

Finch.route "[/]settings",
	setup: ->
		@view = Application.setContentView( new SettingsView )

		Finch.observe "showing", (showing) =>
			return @view.showCreditCard() if showing is "credit_card"
			return @view.showBankAccount() if showing is "bank_account"
			@view.showPersonalInformation()
		#END observe
	#END setup
#END settings

Finch.route "[/]search",
	setup: ->
		@view = Application.setContentView( new SearchView )

		Finch.observe "query", (query) => @view.updateQuery( query )
	#END setup
#END search

Finch.route "[/]profile",
	setup: ->
		@view = Application.setContentView( new ProfileView )
	#END setup
#END profile

Finch.route "[/]profile/:username",
	setup: ({username}) ->
		@view = Application.setContentView( new ProfileView(username) )
	#END setup
#END profile

@Router = Router =
	'gotoDashboard': -> Finch.navigate("/")
	'gotoStream': -> Finch.navigate("/stream")
	'gotoSettings': -> Finch.navigate("/settings")
	'gotoSearch': (params) -> Finch.navigate("/search", params, true)
	'gotoProfile': (user) ->
		if user instanceof SC_User
			Finch.navigate("/profile/#{user.get('id')}")
		else
			Finch.navigate("/profile")
		#END if
	#END gotoProfile
#END Router