Falcon.addBinding 'stopEvent', (element, valueAccessor) ->
	value = ko.unwrap( valueAccessor() )
	value = [value] if _.isString( value )
	for evt in value
		$(element).on evt, (event) ->
			event.stopPropagation()
			event.preventDefault()
			return false
		#END on
	#END for
#END addBinding