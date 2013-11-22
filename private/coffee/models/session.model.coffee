class Session extends Falcon.Model
	url: 'session'

	defaults:
		"soundcloud_access_token": ""
	#END defaults

	makeUrl: -> (Falcon.baseApiUrl + "/" + @url).replace(/([^:])\/\//gi, "$1/")

	toUser: ->
		user = new User( @serialize() )
		user.sc_user.url = "/me"
		user.sc_user.makeUrl = -> @url
		return user
	#END toUser
#END class Session