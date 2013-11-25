Finch.route "/",
	setup: ->
		Application.checkSession()
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
			@view.showPersonalInformation()
		#END observe
	#END setup
#END settings

@Router = Router =
	'gotoDashboard': -> Finch.navigate("/")
	'gotoStream': -> Finch.navigate("/stream")
	'gotoSettings': -> Finch.navigate("/settings")
#END Router