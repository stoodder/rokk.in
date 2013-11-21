
#Regular expression to match URLs
URL_REGEX = /((http\:\/\/|https\:\/\/|ftp\:\/\/)|(www\.))+(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi
EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi
TAG_REGEX = /#[a-z0-9_]+/gi
MENTION_REGEX = /@[a-z0-9_]+/gi

[IS_IE, IE_VERSION] = do ->
	version_details = ( ( navigator.appVersion ? "" ).match(/(\(| )([^;]+)/gi) ? ["",""] )[1] ? ""
	version_details = version_details.toLowerCase()[1..]
	return [
		version_details.indexOf( "msie" ) > -1,
		parseInt( version_details.split(" ", 2)[1] ? "0" )

	]
#END do

IS_SAFARI = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0

IS_PHONE = ( navigator.userAgent.match(/Android/i) or 
			navigator.userAgent.match(/webOS/i) or
			navigator.userAgent.match(/iPhone/i) or
			navigator.userAgent.match(/iPod/i) or
			navigator.userAgent.match(/BlackBerry/i) or
			navigator.userAgent.match(/Windows Phone/i) )

IS_TABLET = navigator.userAgent.match(/iPad/i)

IS_MOBILE = IS_PHONE or IS_TABLET

DESCENDING_ID_COMPARATOR = (model_a, model_b) ->
	a_id = parseInt( model_a.get("id") ? -1 )
	b_id = parseInt( model_b.get("id") ? -1 )
	return -1 if a_id > b_id
	return  1 if a_id < b_id
	return  0
#END DESCENDING_ID_COMPARATOR