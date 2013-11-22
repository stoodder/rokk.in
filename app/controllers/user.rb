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
			our_login(json)
			render "user/one"
			
		rescue Soundcloud::ResponseError => e
			error_response(400, "Error while trying to retrieve user from SoundCloud")
		end
	end
end
