class Donation extends Falcon.Model
	url: 'donation'

	defaults:
		"amount": 0
		"frequency": "once"
		"soundcloud_user_id": ""
		"balanced_card_uri": null
	#END defaults

	validate: ->
		amount = @get('amount')
		return false unless _.isNumber( amount ) and amount > 0

		frequency = @get('frequency')
		return false unless frequency in ["once", "weekly"]

		return true
	#END validate
#END donation