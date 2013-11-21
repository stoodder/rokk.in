class Session extends Falcon.Model
	url: 'session'

	makeUrl: -> (Falcon.baseApiUrl + "/" + @url).replace(/([^:])\/\//gi, "$1/")

	toUser: ->
		user = new User( @serialize() )
		return user
	#END toUser
#END class Session