class SoundCloudModel extends Falcon.Model
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

		SC.accessToken( options.access_token ) if options.access_token?

		url = @makeUrl( type )
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

		return SC[method](url, callback)
	#END sync
#END SoundCloudModel