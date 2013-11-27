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

@Router = Router =
	'gotoDashboard': -> Finch.navigate("/")
	'gotoStream': -> Finch.navigate("/stream")
	'gotoSettings': -> Finch.navigate("/settings")
	'gotoSearch': (params) -> Finch.navigate("/search", params, true)
#END Router