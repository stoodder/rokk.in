class SoundCloudCollection extends Falcon.Collection
	makeUrl: (type, parent) ->
		original_base_api_url = Falcon.baseApiUrl
		Falcon.baseApiUrl = ""
		url = super(type, parent)
		Falcon.baseApiUrl = original_base_api_url
		return url
	#END makeUrl
	sync: (type, options, context) -> SoundCloudModel::sync.call(@,type,options,context)
#END SoundCloudCollection