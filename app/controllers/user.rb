RokkIn::App.controller do
	post "/user", :provides=>:json do
		error_response(400, "No Access Token Given") if json['soundcloud_access_token'].nil?

		soundcloud_client = SoundCloud.new(:access_token => json['soundcloud_access_token'])

		begin
			soundcloud_user = soundcloud_client.get("/me")
			error_response(400, "Error while trying to retrieve user from SoundCloud") if soundcloud_user.nil?

			@user = User.new
			@user.soundcloud_user = soundcloud_user
			verify!(@user)

			@user.save()
			@user.create_balanced_customer!

			our_login(json)
			render "user/one", :locals => {:show_full_user => true}
			
		rescue Soundcloud::ResponseError => e
			error_response(400, "Error while trying to retrieve user from SoundCloud")
		end
	end

	put "/user/:user_id", :provides => :json do |user_id|
		authenticated!
		user_id = user_id.to_i
		error_response(403, "You're not allowed to updated this user.") if current_user.id != user_id
			
		@user = fetch(User, user_id)

		@user.set_fields(json, User.allowed_update_columns, :missing => :skip)
		verify!(@user)

		@user.save()

		if json['balanced_card_uri']
			begin
				@user.set_balanced_card_uri!(json['balanced_card_uri'])
			rescue => e
				error_response(400, "Error while saving credit card information")
			end
		elsif params['remove_credit_card']
			begin
				@user.remove_credit_card!()
			rescue => e
				error_response(400, "An error occurred while trying to remove the credit card")
			end
		end
		
		render "user/one", :locals => {:show_full_user => true}
	end
end
