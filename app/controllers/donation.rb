RokkIn::App.controllers do
	post "/donation", :provides => :json do
		authenticated!
		error_response(400, "Must have a credit card on file to donate") if current_user.balanced_card_uri.blank?

		begin
			@donation = Donation.new
			@donation.set_fields(json, Donation.allowed_create_columns, :missing => :skip)
			@donation.from_user = current_user

			@donation.save()

			@donation.charge! if @donation.frequency == "once"
		rescue => e
			puts( e )
			error_response(400, "Error debiting credit card")
		end

		render 'donation/one'
	end
end
