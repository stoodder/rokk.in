class SettingsView extends Falcon.View
	url: "#settings-tmpl"

	defaults:
		'credit_card_widget': -> new CreditCardWidget
	#END defaults

	observables:
		'alert': ''
		'is_saving': false
		'current_user': null

		'is_showing_personal_information': false
		'is_showing_credit_card': false
		'is_showing_bank_account': false

		'current_credit_card_last_4': ''
		'current_credit_card_type': ''
		'has_credit_card': -> not _.isEmpty( @current_credit_card_last_4() ) or not _.isEmpty( @current_credit_card_type() )

		'current_bank_name': ""
		'current_bank_account_number': ""
		'has_bank_account': -> not _.isEmpty( @current_bank_name() ) or not _.isEmpty( @current_bank_account_number() )

		'bank_account_name': ""
		'bank_account_account_number': ""
		'bank_account_routing_number': ""
	#END osbervables

	initialize: ->
		@alert.classify("validateable")
			
		@bank_account_name.classify("validateable")
		@bank_account_account_number.classify("validateable")
		@bank_account_routing_number.classify("validateable")

		#Realtime Validation of Bank Account Name
		ko.computed =>
			name = @bank_account_name()
			@bank_account_name.is_valid( not _.isEmpty(name) )
		#END computed

		#Realtime Validation of Bank Account Number
		ko.computed =>
			account_number = @bank_account_account_number()
			@bank_account_account_number.is_valid( not _.isEmpty(account_number) )
		#END computed

		#Realtime Validation of Bank Routing Number
		ko.computed =>
			routing_number = @bank_account_routing_number()
			@bank_account_routing_number.is_valid( balanced.bankAccount.validateRoutingNumber(routing_number) )
		#END computed

		@showPersonalInformation()
	#NED initialize

	display: ->
		Application.on("update:user", @updateCurrentUser, @)
		@updateCurrentUser( Application.current_user() )
	#END display

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
			
			@current_bank_name( current_user.get('bank_name') )
			@current_bank_account_number( current_user.get('bank_account_number') )
		else
			@current_credit_card_last_4("")
			@current_credit_card_type("")

			@current_bank_name("")
			@current_bank_account_number("")
		#END if
	#END populateData

	#=======================================================
	#
	# PRIVATE METHODS
	#
	#=======================================================
	_reset: ->
		@is_showing_personal_information( false )
		@is_showing_credit_card( false )
		@is_showing_bank_account( false )

		@_resetFields()
	#END _reset

	_resetFields: ->
		@alert("")

		@credit_card_widget.resetFields()

		@bank_account_name("")
		@bank_account_account_number("")
		@bank_account_routing_number("")

		@_clearValidations()
	#END _resetFields

	_clearValidations: ->
		@alert.clearValidations()

		@credit_card_widget.clearValidations()

		@bank_account_name.clearValidations()
		@bank_account_account_number.clearValidations()
		@bank_account_routing_number.clearValidations()
	#END _clearValidations

	_hasError: ->
		return true if @alert.has_error()

		if @is_showing_credit_card()
			return @credit_card_widget.hasError()
		else if @is_showing_bank_account()
			return ( @bank_account_routing_number.has_error() or @bank_account_account_number.has_error() or @bank_account_name.has_error() )
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
		return false unless confirm("Are you sure you want to cancel saving your credit card?")
		@_resetFields()
	#END cancelSaveCreditCard
	
	saveCreditCard: ->
		return false unless ( current_user = @current_user() ) instanceof User
		return false if @is_saving()

		@is_saving( true )

		_saveCardToUser = (balanced_card_uri) =>
			current_user.clone(["id"]).set({balanced_card_uri}).save
				attributes: ["balanced_card_uri"]
				complete: => @is_saving( false )
				success: (user) =>
					current_user.fill( user.unwrap() )
					@populateData()
					@_resetFields()
					@alert("Successfully saved credit card information!")
				#END success
				error: => @alert.error("Error while saving credit card information")
			#END save
		#END _saveCardToUser

		@credit_card_widget.createCardOnBalanced
			success: _saveCardToUser
			error: =>
				@is_saving( false )
				@alert.error("An error occurred while saving credit card information")
			#END error
		#END createCardOnBalanced

		return false
	#END saveCreditCard

	removeCreditCard: ->
		return false unless ( current_user = @current_user() ) instanceof User
		return false unless current_user.get('balanced_card_uri')
		return false if @is_saving()

		return false unless confirm("Are you sure you want to remove your credit card?")

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

		return false
	#END removeCreditCard

	#=======================================================
	#
	# BANK ACCOUNT METHODS
	#
	#=======================================================
	showBankAccount: ->
		@_reset()
		@is_showing_bank_account( true )
	#END showBankAccount

	cancelSaveBankAccount: ->
		return false if @is_saving()
		return false unless confirm("Are you sure you want to cancel saving your bank account?")
		@_resetFields()
	#END cancelSaveCreditCard

	saveBankAccount: ->
		return false unless ( current_user = @current_user() ) instanceof User
		return false if @is_saving()

		@_clearValidations()

		routing_number = @bank_account_routing_number()
		account_number = @bank_account_account_number()
		name = @bank_account_name()

		@bank_account_routing_number.error("Please enter a routing number") if _.isEmpty( routing_number )
		@bank_account_account_number.error("Please enter a account number") if _.isEmpty( account_number )
		@bank_account_name.error("Please enter a name") if _.isEmpty( name )

		return false if @_hasError()

		bank_account_obj = {routing_number, account_number, name}

		validations = balanced.bankAccount.validate(bank_account_obj)

		@bank_account_routing_number.error(validations.routing_number) if validations.routing_number?
		@bank_account_account_number.error(validations.account_number) if validations.account_number?
		@bank_account_name.error(validations.name) if validations.name?

		return false if @_hasError()

		@bank_account_routing_number.is_valid(true)
		@bank_account_account_number.is_valid(true)
		@bank_account_name.is_valid(true)

		@is_saving( true )

		_saveBankAccountToUser = (balanced_bank_account_uri) =>
			current_user.clone(["id"]).set({balanced_bank_account_uri}).save
				attributes: ["balanced_bank_account_uri"]
				complete: => @is_saving( false )
				success: (user) =>
					current_user.fill( user.unwrap() )
					@populateData()
					@_resetFields()
					@alert("Successfully saved bank account information!")
				#END success
				error: => @alert.error("Error while saving bank account information")
			#END save
		#END _saveBankAccountToUser

		balanced.bankAccount.create bank_account_obj, (response) =>
			switch response.status
				when 201
					return _saveBankAccountToUser(response.data.uri)
				else
					@alert.error("An error occurred while saving bank account information")
				#END when
			#END switch

			@is_saving( false )
		#END create

		return false
	#END saveBankAccount

	removeBankAccount: ->
		return false unless ( current_user = @current_user() ) instanceof User
		return false unless current_user.get('balanced_bank_account_uri')
		return false if @is_saving()

		return false unless confirm("Are you sure you want to remove your bank account?")

		@is_saving( true )
		current_user.clone(["id"]).save
			params: {"remove_bank_account": true}
			attributes: []
			success: (user) => 
				current_user.fill( user.unwrap() )
				@populateData()
				@_clearValidations()
				@alert("Successfully removed bank account")
			#END success

			error: =>
				@alert.error("There was an error while trying to remove your credit card")
			#END error

			complete: => @is_saving( false )
		#END save

		return false
	#END removeBankAccount


	gotoPersonalInfomration: -> Finch.navigate({"showing": null}, true)
	gotoCreditCard: -> Finch.navigate({"showing": "credit_card"}, true)
	gotoBankAccount: -> Finch.navigate({"showing": "bank_account"}, true)
#END SettingsView