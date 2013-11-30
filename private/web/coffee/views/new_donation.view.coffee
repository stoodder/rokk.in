class NewDonationView extends Falcon.View
	url: '#new_donation-tmpl'

	defaults:
		'sc_user': (sc_user) -> ko.unwrap( sc_user )
		'credit_card_widget': -> new CreditCardWidget
		'donation': -> new Donation
	#END defaults

	observables:
		'alert': null
		'current_user': null

		'is_loading': false
		'is_saving': false
		'is_showing_new_credit_card': false
		'is_showing_success': false

		'donation_amount': null
		'donation_frequency': 'once'
		'donation_message': ''
		'is_donation_anonymous': false

		'is_frequency_once': -> @donation_frequency() is 'once'
		'is_frequency_weekly': -> @donation_frequency() is 'weekly'
	#END observables

	initialize: ->
		@alert.classify("validateable")
	#END initialize

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
		@is_showing_new_credit_card( _.isEmpty( user.get('balanced_card_uri') ) )
	#END updateCurrentUser

	setFrequencyToOnce: -> @donation_frequency("once")
	setFrequencyToWeekly: -> @donation_frequency("weekly")

	showNewCreditCard: -> @is_showing_new_credit_card( true )

	setIsAnonymous: -> @is_donation_anonymous( true )
	setIsntAnonymous: -> @is_donation_anonymous( false )

	cancelDonation: ->
		return false if @is_saving()
		@trigger("cancel")
		return false
	#END cancelDonation


	createDonation: ->
		return false unless ( current_user = @current_user() ) instanceof User
		return false if @is_saving()

		amount = parseFloat( @donation_amount() )
		frequency = @donation_frequency()
		message = @donation_message()
		is_anonymous = @is_donation_anonymous()
		soundcloud_user_id = @sc_user.get('id')

		donation = new Donation({amount, frequency, message, is_anonymous, soundcloud_user_id})

		@is_saving( true )

		_saveDonation = =>
			donation.create
				complete: => @is_saving( false )
				success: (donation) =>
					@donation.fill( donation.unwrap() )
					@is_showing_success( true )
				#END success
			#END create
		#END _saveDonation

		_saveCardToUser = (balanced_card_uri) =>
			current_user.clone(["id"]).set({balanced_card_uri}).save
				attributes: ["balanced_card_uri"]

				success: (user) =>
					current_user.fill( user.unwrap() )
					_saveDonation()
				#END success

				error: =>
					@alert.error("Error while saving credit card information")
					@is_saving( false )
				#END error
			#END save
		#END _saveCardToUser

		

		if @is_showing_new_credit_card()
			@credit_card_widget.createCardOnBalanced
				success: _saveCardToUser
				error: => @is_saving( false )
			#END createCardOnBalanced
		else
			_saveDonation()
		#END if

		return false
#END NewDonationView