class SoundCloudCollection extends Falcon.Collection
	sync: (type, options, context) -> SoundCloudModel::sync.call(@,type,options,context)
#END SoundCloudCollection