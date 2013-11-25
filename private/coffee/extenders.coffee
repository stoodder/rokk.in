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

ko.extenders["validateable"] = (target, options) ->
	_error = ko.observable("")
	_is_valid = ko.observable(false)

	target.error = ko.computed
		read: -> _error()
		write: (value) ->
			value = _.trim( (value ? "").toString() )
			_is_valid(false) unless _.isEmpty( value )
			_error(value)
		#END write
	#END error

	target.has_error = ko.computed -> target.error().length > 0

	target.is_valid = ko.computed
		read: -> not target.has_error() and _is_valid()
		write: (value) ->
			target.error("") if value is true
			_is_valid(value)
		#END write
	#END is_valid

	target.clearValidations = ->
		target.error("")
		_is_valid(false)
	#END clear_validations
	
	return target
#END errorable extender