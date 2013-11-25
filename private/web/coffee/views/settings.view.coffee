class SettingsView extends Falcon.View
	url: "#settings-tmpl"

	observables:
		'alert': ''
		'is_saving': false
		'current_user': null

		'is_showing_personal_information': false
		'is_showing_credit_card': false

		'current_credit_card_last_4': ''
		'current_credit_card_type': ''
		'has_credit_card': -> not _.isEmpty( @current_credit_card_last_4() ) or not _.isEmpty( @current_credit_card_type() )

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

				@credit_card_expiration_month( month )
				@credit_card_expiration_year( year )
			#END write
		#END credit_card_expiration
	#END osbervables

	initialize: ->
		@alert.classify("validateable")
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

		Application.on("update:user", @updateCurrentUser, @)

		@showPersonalInformation()
	#NED initialize

	dispose: ->
		Application.off("update:user", @updateCurrentUser)
	#END dispose

	updateCurrentUser: (user) ->
		return if user is @current_user()
		@current_user( user )
		@populateData()
	#END updateCurrentUser

	populateData: ->
		if ( current_user = @current_user() ) instanceof User
			@current_credit_card_last_4( current_user.get('card_last_4') )
			@current_credit_card_type( current_user.get('card_type') )
		else
			@current_credit_card_last_4("")
			@current_credit_card_type("")
		#END if

		@credit_card_number("")
		@credit_card_expiration("")
		@credit_card_cvc("")
	#END populateData

	#=======================================================
	#
	# PRIVATE METHODS
	#
	#=======================================================
	_reset: ->
		@is_showing_personal_information( false )
		@is_showing_credit_card( false )

		@credit_card_number("")
		@credit_card_expiration("")
		@credit_card_cvc("")

		@_clearValidations()
	#END _reset

	_clearValidations: ->
		@alert.clearValidations()
		@credit_card_number.clearValidations()
		@credit_card_expiration.clearValidations()
		@credit_card_cvc.clearValidations()
	#END _clearValidations

	_hasError: ->
		if @is_showing_credit_card()
			return ( @credit_card_number.has_error() or @credit_card_expiration.has_error() or @credit_card_cvc.has_error() )
		#END if

		return false
	#END _hasError

	#=======================================================
	#
	# PERSONAL INFORMATION METHODS
	#
	#=======================================================
	showPersonalInformation: ->
		@_reset()
		@is_showing_personal_information( true )
	#END showPersonalInformation

	#=======================================================
	#
	# CREDIT CARD METHODS
	#
	#=======================================================
	showCreditCard: ->
		@_reset()
		@is_showing_credit_card( true )
	#END showCreditCard

	cancelSaveCreditCard: ->
		return false if @is_saving()
		@credit_card_number("")
		@credit_card_expiration("")
		@credit_card_cvc("")
		return false
	#END cancelSaveCreditCard
	
	saveCreditCard: ->
		return unless ( current_user = @current_user() ) instanceof User
		return false if @is_saving()

		@_clearValidations()

		credit_card_number = @credit_card_number()
		credit_card_expiration = @credit_card_expiration()
		credit_card_cvc = @credit_card_cvc()

		credit_card_expiration_month = @credit_card_expiration_month()
		credit_card_expiration_year = @credit_card_expiration_year()

		@credit_card_number.error("Please enter a valid credit card number.") unless balanced.card.isCardNumberValid( credit_card_number )
		@credit_card_expiration.error("Please enter a valid expiration date.") unless balanced.card.isExpiryValid(credit_card_expiration_month, credit_card_expiration_year)
		@credit_card_cvc.error("Please enter a valid CVC Number.") unless balanced.card.isSecurityCodeValid(credit_card_number, credit_card_cvc)

		return false if @_hasError()

		@credit_card_number.is_valid(true)
		@credit_card_expiration.is_valid(true)
		@credit_card_cvc.is_valid(true)

		@is_saving( true )

		_saveCardToUser = (balanced_card_uri) =>
			current_user.clone(["id"]).set({balanced_card_uri}).save
				attributes: ["balanced_card_uri"]
				complete: => @is_saving( false )
				success: (user) =>
					current_user.fill( user.unwrap() )
					@populateData()
					@alert("Successfully saved credit card information!")
				#END success
				error: => @alert.error("Error while saving credit card information")
			#END save
		#END _saveCardToUser

		balanced.card.create {
			'card_number': credit_card_number
			'expiration_month': credit_card_expiration_month
			'expiration_year': credit_card_expiration_year
			'security_code': credit_card_cvc
		}, (response) =>
			switch response.status
				when 201
					return _saveCardToUser(response.data.uri)
				else
					@alert.error("An error occurred while saving credit card information")
				#END when
			#END switch

			@is_saving( false )
		#END create

		return false
	#END saveCreditCard

	removeCreditCard: ->
		return unless ( current_user = @current_user() ) instanceof User
		return unless current_user.get('balanced_card_uri')
		return if @is_saving()

		return unless confirm("Are you sure you want to remove your credit card?")

		@is_saving( true )
		current_user.clone(["id"]).save
			params: {"remove_credit_card": true}
			attributes: []
			success: (user) => 
				current_user.fill( user.unwrap() )
				@populateData()
				@_clearValidations()
				@alert("Successfully removed credit card")
			#END success

			error: =>
				@alert.error("There was an error while trying to remove your credit card")
			#END error

			complete: => @is_saving( false )
		#END save
	#END removeCreditCard


	gotoPersonalInfomration: -> Finch.navigate({"showing": null}, true)
	gotoCreditCard: -> Finch.navigate({"showing": "credit_card"}, true)
#END SettingsView