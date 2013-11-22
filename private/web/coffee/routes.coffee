Finch.route "/",
	setup: ->
		Application.checkSession()
	#END setup

	load: ->
		Application.setContentView( new DashboardView )
	#END load
#END /

@Router = Router =
	'gotoHome': -> Finch.navigate("/")
#END Router