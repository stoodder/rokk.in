class ApplicationView extends Falcon.View
	url: '#application-tmpl'

	_connect_options = {}

	defaults:
		'splash_view': -> new SplashView
	#END defaults

	observables:
		'current_user': null
		'content_view': null
		'modal_view': null

		'is_logged_in': false
		'is_checking_session': false
		'is_connecting': false
		'is_showing_modal': false

		'is_dashboard_selected': -> @content_view() instanceof DashboardView
		'is_stream_selected': -> @content_view() instanceof StreamView
	#END observables

	checkSession: ->
		return if @is_checking_session()

		@is_checking_session( true )
		( new Session ).fetch
			success: (session, data) => @login( session )
			error: (session) => @is_checking_session( false )
		#END fetch
	#END checkSession

	login: (session) ->
		return unless session instanceof Session
		return false if _.isEmpty( access_token = session.get("soundcloud_access_token") )

		user = session.toUser()

		SC.accessToken( access_token )
		user.sc_user.fetch
			'access_token': access_token
			success: (sc_user) =>
				user.sc_user.fill( user.sc_user.unwrap() )
				@current_user( user )
				@is_logged_in( true )
				@notifySubscribers()
			#END success

			complete: => @is_checking_session( false )
		#END fetch
	#END login

	logout: ->
		return unless @is_logged_in()

		( new Session ).destroy
			success: =>
				@current_user( null )
				SC.accessToken( null )
				@is_logged_in( false )
				@notifySubscribers()
			#END success
		#END destroy
	#END logout

	connect: (options) ->
		@is_connecting( true )

		#Set Up the options
		options = {success: options} if _.isFunction( options )
		options ?= {}
		options.success ?= (->)
		options.error ?= (->)
		options.complete ?= (->)

		#Configure the internal connect options to carry over
		_connect_options = options

		#Execute the actual connect
		dialog = SC.connect( -> )
		console.log( dialog )

		setTimeout ->
			return unless _connect_options is options
			dialog.options.window.close()
			_connect_options.error("timeout", "Connect timed out")
			_connect_options.complete()
			_connect_options = null
		, 30000

		return {
			abort: ->
				return unless _connect_options is options
				_connect_options.error("abortted", "User canceled request")
				_connect_options.complete()
				_connect_options = null
			#END cancel
		} #END return
	#END connect

	connectResponse: (status, params) ->
		return unless @is_connecting()
		@is_connecting( false )
		
		if status is "success"
			SC.connectCallback()
			_connect_options.success( SC.accessToken() )
			_connect_options.complete()
			_connect_options = null
		else
			_connect_options.error(params['error'], params['error_description'])
			_connect_options.complete()
			_connect_options = null
			SC.connectCallback()
		#END if
	#END connectResponse

	setContentView: (view) ->
		return unless Falcon.isView( view )

		@content_view( view )
		@notifySubscribers()
	#END setContentView

	notifySubscribers: ->
		return unless Falcon.isView( content_view = @content_view() )
		@trigger("update:user", @current_user())
	#END notifySubscribers
#END ApplicationView