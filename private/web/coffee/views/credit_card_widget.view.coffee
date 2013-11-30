class CreditCardWidget extends Falcon.View
	url: '#credit_card_widget-tmpl'

	observables:
		'credit_card_type': ''
		'credit_card_expiration_month': ''
		'credit_card_expiration_year': ''
		'credit_card_cvc': ''

		'_credit_card_number': ''
		'credit_card_number':
			read: ->  Helpers.formatCreditCardNumber( @_credit_card_number )
			write: (number) -> @_credit_card_number( number )
		#END credit_card_number

		'credit_card_expiration':
			read: ->
				year = _.trim( ko.unwrap( @credit_card_expiration_year ) ? "" )
				month = _.trim( ko.unwrap( @credit_card_expiration_month ) ? "" )

				return '' if _.isEmpty( year ) or _.isEmpty( month )

				return "#{month}/#{year}"
			#END read

			write: (value) ->
				value = _.trim( value ? "" )
				[month, year] = value.split("/")

				month = _.trim( month ? "" )
				year = _.trim( year ? "" )

				year = "20#{year}" if year.length is 2
				month = "0#{month}" if month.length is 1
				year = year[0...4]
				month = month[0...2]

				console.log( month, year )

				@credit_card_expiration_month( month )
				@credit_card_expiration_year( year )
			#END write
		#END credit_card_expiration
	#END osbervables

	initialize: ->
		@credit_card_number.classify("validateable")
		@credit_card_expiration.classify("validateable")
		@credit_card_cvc.classify("validateable")

		#Realtime validation of CC Number
		ko.computed =>
			number = @credit_card_number()
			is_valid = balanced.card.isCardNumberValid(number)
			@credit_card_number.is_valid( is_valid )
			@credit_card_type( if is_valid then balanced.card.cardType( number ) else "" )
		#END computed

		#Realtime validation of CC Expiration
		ko.computed =>
			@credit_card_expiration()
			month = @credit_card_expiration_month.peek()
			year = @credit_card_expiration_year.peek()

			@credit_card_expiration.is_valid( balanced.card.isExpiryValid(month, year) )
		#END computed

		#Realtime validation of CC Security Code
		ko.computed =>
			number = @credit_card_number()
			cvc = @credit_card_cvc()
			@credit_card_cvc.is_valid( balanced.card.isSecurityCodeValid(number, cvc) )
		#END computed
	#END initialize

	resetFields: ->
		@credit_card_number("")
		@credit_card_expiration("")
		@credit_card_cvc("")
	#END resetFields

	clearValidations: ->
		@credit_card_number.clearValidations()
		@credit_card_expiration.clearValidations()
		@credit_card_cvc.clearValidations()
	#END clearValidations

	hasError: -> @credit_card_number.has_error() or @credit_card_expiration.has_error() or @credit_card_cvc.has_error()

	createCardOnBalanced: (options) ->
		options = {complete: options} if _.isFunction( options )
		options = {} unless _.isObject( options )
		options.success ?= (->)
		options.error ?= (->)
		options.complete ?= (->)

		credit_card_number = @credit_card_number()
		credit_card_cvc = @credit_card_cvc()

		credit_card_expiration_month = @credit_card_expiration_month()
		credit_card_expiration_year = @credit_card_expiration_year()

		console.log( "This: ", credit_card_expiration_month, credit_card_expiration_year )

		@credit_card_number.error("Please enter a valid credit card number.") unless balanced.card.isCardNumberValid( credit_card_number )
		@credit_card_expiration.error("Please enter a valid expiration date.") unless balanced.card.isExpiryValid(credit_card_expiration_month, credit_card_expiration_year)
		@credit_card_cvc.error("Please enter a valid CVC Number.") unless balanced.card.isSecurityCodeValid(credit_card_number, credit_card_cvc)

		if @hasError()
			options.error()
			options.complete()
			return
		#END if

		@credit_card_number.is_valid(true)
		@credit_card_expiration.is_valid(true)
		@credit_card_cvc.is_valid(true)

		balanced.card.create {
			'card_number': credit_card_number
			'expiration_month': credit_card_expiration_month
			'expiration_year': credit_card_expiration_year
			'security_code': credit_card_cvc
		}, (response) =>
			switch response.status
				when 201
					options.success( response.data.uri )
				else
					options.error()
				#END when
			#END switch

			options.complete()
		#END create
	#END createCardOnBalanced
#END CreditCardWidget