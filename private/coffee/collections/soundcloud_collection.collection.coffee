class SoundCloudCollection extends Falcon.Collection

	makeUrl: (type, parent) ->
		original_base_api_url = Falcon.baseApiUrl
		Falcon.baseApiUrl = ""
		url = super(type, parent)
		Falcon.baseApiUrl = original_base_api_url
		return url
	#END makeUrl

	sync: (type, options, context) ->
		SoundCloudModel::sync.call(@,type,options,context)
	#END sync

	search: (params, options) ->
		params = {'q': params} if _.isString( params )
		params = {} unless _.isObject( params )

		options = {success: options} if _.isFunction( options )
		options = {} unless _.isObject( options )
		options.params = params

		@fetch( options )
	#END search

#END SoundCloudCollection