Finch.route "/",
	setup: ->
		Application.checkSession()
	#END setup
#END /

@Router = Router = {}
#END Router