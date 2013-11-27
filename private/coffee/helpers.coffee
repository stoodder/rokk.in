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
		ret += ko.unwrap(arg) for arg in arguments
		return ret
	#END concat

	'isEmail': (emailStr) ->
		emailStr = ko.unwrap( emailStr )
		emailStr = "" unless _.isString( emailStr )
		emailStr = _.trim( emailStr )
		new RegExp( EMAIL_REGEX ).test( emailStr )
	#END isEmail

	'isUrl': (urlStr) ->
		urlStr = ko.unwrap( urlStr )
		urlStr = "" unless _.isString( urlStr )
		urlStr = _.trim( urlStr )
		new RegExp( URL_REGEX ).test( urlStr )
	#END isEmail

	#----------------------------------
	###
		* t500x500:     500×500
		* crop:         400×400
		* t300x300:     300×300
		* large:        100×100 (default)
		* t67x67:       67×67    (only on artworks)
		* badge:        47×47
		* small:        32×32
		* tiny:         20×20    (on artworks)
		* tiny:         18×18    (on avatars)
		* mini:         16×16
		* original:     (originally uploaded image)
    ###
	#----------------------------------
	resizeImage: (avatar_url, size) ->
		avatar_url = ko.unwrap( avatar_url ) ? ""
		avatar_url.replace("-large.", "-#{size}.")
	#END resizeImage

	formatCreditCardNumber: (cc_number) ->
		cc_number = ko.unwrap( cc_number )
		cc_number = _.trim( ( cc_number ? "" ).toString() )
		cc_number = cc_number.replace(/[^0-9]/gi, "")[0..15]
		cc_number = _.trim( [cc_number[0..3], cc_number[4..7], cc_number[8..11], cc_number[12..15]].join(" ") ).replace(/\s+/gi, "-")
		return cc_number
	#END formatCreditCardNumber

	creditCardImageUrl: (card_type) ->
		card_type = ko.unwrap( card_type )
		card_type = "" unless _.isString( card_type )
		card_type = _.trim( card_type ).toLowerCase()

		return "/images/cards/visa.png" if card_type is "visa"
		return "/images/cards/mastercard.png" if card_type is "mastercard"
		return "/images/cards/discover.png" if card_type is "discover"
		return "/images/cards/amex.png" if card_type is "american express"
		return "/images/cards/jcb.png" if card_type is "jcb"
		return "/images/cards/diners.png" if card_type is "diners club"
		return "/images/cards/credit.png"
	#END creditCardImageUrl
#END Helpers