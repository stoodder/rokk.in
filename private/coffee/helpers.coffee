@Helpers = Helpers =
	escapeHTML: (html) ->
		html = "" unless _.isString(html)
		return 
	#END escapeHTML

	#Some text returns html entities that look like html when rendered
	#we need to remove that
	removeEntityHtmlFromText: (html) ->
		html = $("<div/>").html(html).text()
		return html.replace(/<[^>]+>/gi, " ")
	#END removeEntityHtmlFromText

	replaceHtmlEntitiesWithText: (text) ->
		text = ko.unwrap(text)
		text = text.replace("&nbsp;", " ")
		text = text.replace("&lt;", "<")
		text = text.replace("&gt;", ">")
		text = text.replace("&amp;", "&")
		return text
	#END replaceHtmlEntitiesWithText

	concat: () ->
		ret = ""
		ret += unwrap(arg) for arg in arguments
		return ret
	#END concat

	'isEmail': (emailStr) ->
		emailStr = unwrap( emailStr )
		emailStr = "" unless _.isString( emailStr )
		emailStr = _.trim( emailStr )
		new RegExp( EMAIL_REGEX ).test( emailStr )
	#END isEmail

	'isUrl': (urlStr) ->
		urlStr = unwrap( urlStr )
		urlStr = "" unless _.isString( urlStr )
		urlStr = _.trim( urlStr )
		new RegExp( URL_REGEX ).test( urlStr )
	#END isEmail

	'resize_avatar': (avatar_url, size) ->
		avatar_url = ko.unwrap( avatar_url ) ? ""
		avatar_url.replace("-large.", "-#{size}.")
	#END resize_avatar
#END Helpers