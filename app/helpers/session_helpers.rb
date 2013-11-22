RokkIn::App.helpers do
	helpers Shield::Helpers

	def current_user
		authenticated(User)
	end

	def is_logged_in?
		!! current_user
	end	

	def authenticated!
		error_response(401, "User is not authenticated") unless is_logged_in?
	end

	def our_login(arguments)
		access_token = arguments['soundcloud_access_token'] || session['soundcloud_access_token']
		return false if access_token.nil?

		soundcloud_client = SoundCloud.new(:access_token => access_token)

		begin

			soundcloud_user = soundcloud_client.get("/me")
			return false if soundcloud_user.nil?

			user = User.first(:soundcloud_id => soundcloud_user.id)
			return false if user.nil?

			authenticate(user)
			if is_logged_in?
				session['soundcloud_access_token'] = access_token
				return true
			else
				return false
			end
			
		rescue Soundcloud::ResponseError => e
			return false
		end
	end
end
