RokkIn::App.controller do
	post "/session", :provides=>:json do
		error_response(400, "Invalid credentials") unless our_login(json)
		render "session/one", :locals=>{:user=>current_user}
	end

	get "/session", :provides=>:json do
		error_response(404, "No user logged in") unless is_logged_in?
		render "session/one", :locals=>{:user=>current_user}
	end

	delete "/session", :provides=>:json do
		user = current_user
		logout(User)
		render "session/one", :locals=>{:user=>user}
	end
end
