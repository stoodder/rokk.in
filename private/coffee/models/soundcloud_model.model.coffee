class SoundCloudModel extends Falcon.Model
	makeUrl: (type, parent, id) ->
		original_base_api_url = Falcon.baseApiUrl
		Falcon.baseApiUrl = ""
		url = super(type, parent, id)
		Falcon.baseApiUrl = original_base_api_url
		return url
	#END makeUrl

	sync: (type, options, context) ->
		type = "GET" unless _.isString( type )
		type = _.trim( type ).toUpperCase()
		type = "GET" unless type in ["GET", "POST", "PUT", "DELETE"]

		context ?= @

		options ?= {}
		options.fill ?= true
		options.success ?= (->)
		options.error ?= (->)
		options.complete ?= (->)
		options.params ?= {}

		SC.accessToken( options.access_token ) if options.access_token?

		url = options.url ? @makeUrl( type, @parent )
		callback = (data, error) =>
			parsed_data = @parse( data, options )
			@fill( parsed_data ) if options.fill
			if error
				options.error.call( context, @, data, error )
			else
				options.success.call( context, @, data )
			#END if

			options.complete.call( context, @, data )
		#END callback

		switch type
			when "GET" then method = 'get'
			when "POST" then method = 'post'
			when "PUT" then method = 'put'
			when "DELETE" then method = 'delete'
		#END switch

		return SC[method](url, options.params, callback)
	#END sync
#END SoundCloudModel