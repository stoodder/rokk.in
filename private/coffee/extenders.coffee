ko.extenders["errorable"] = (target, options) ->
	target.error = ko.observable("")
	target.has_error = ko.computed ->
		err = target.error()
		err = "" unless _.isString( err )
		return _.trim(err).length > 0
	target.clear_error = -> target.error("")
	
	return target
#END errorable extender

ko.extenders['resetAfter'] = (target, duration) ->
	originalValue = ko.utils.unwrapObservable( target )

	target.subscribe (value) ->
		return if value is originalValue
		setTimeout ( -> target( originalValue ) ), duration
	#END subscribe

	return target
#END resetAfter