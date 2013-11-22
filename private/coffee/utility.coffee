_.mixin
	trim: (str) ->
		return "" unless str?
		return str.toString().replace(/^\s+/, '').replace(/\s+$/, '')
	#END _.trim
#END mixin