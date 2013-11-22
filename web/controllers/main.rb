RokkIn::Web.controllers do
	get "/" do
		haml :index
	end

	#TODO: Split this into it's own file, used for responding to 
	#soundcloud connect requests
	get "/respond" do
		require 'json'
		@params = params
		haml :respond
	end
end
