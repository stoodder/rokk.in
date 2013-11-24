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
		@view = new StreamView
		Application.setContentView( @view )
	#END setup
#END stream

@Router = Router =
	'gotoDashboard': -> Finch.navigate("/")
	'gotoStream': -> Finch.navigate("/stream")
#END Router