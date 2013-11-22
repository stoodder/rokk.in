Falcon.addBinding "src", (element, valueAccessor) ->
	value = ko.unwrap( valueAccessor() )
	element.setAttribute("src", value)
#END src