class SearchView extends Falcon.View
	url: '#search-tmpl'

	defaults:
		'sc_users': -> new SC_Users
		'sc_tracks': -> new SC_Tracks
	#END defaults

	observables:
		'current_user': null
		'query': ''

		'is_loading_users': false
		'is_loading_tracks': false
	#END observabels

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
		@search()
	#END updateCurrentUser

	updateQuery: (query) ->
		query = "" unless _.isString( query )
		query = _.trim( query )
		return if query is @query()
		@query( query )
		@search()
	#END updateQuery

	search: ->
		return unless Application.is_logged_in()

		query = @query()

		if _.isEmpty( query )
			@sc_users.reset()
			@sc_tracks.reset()
		else
			@is_loading_users( true )
			@sc_users.search query, => @is_loading_users( false )

			@is_loading_tracks( true )
			@sc_tracks.search query, => @is_loading_tracks( false )
		#END if
	#END search
#END SeatchView