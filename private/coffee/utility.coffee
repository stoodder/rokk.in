_.mixin
	trim: (str) ->
		return "" unless str?
		return str.toString().replace(/^\s+/, '').replace(/\s+$/, '')
	#END _.trim
#END mixin

ko.subscribable.fn.classify = (identifiers...) ->
	extenders = {}

	for identifier in identifiers when _.isString(identifier) and not _.isEmpty(identifier)
		extenders[identifier] = true
	#END for

	return this.extend(extenders) 
#END classify