throw "Could not find ENV variables" unless ENV?
@Application = Application = new ApplicationView

# Initialize Sound Cloud
SC.initialize
	client_id: ENV['SOUNDCLOUD_CLIENT_ID']
	redirect_uri: ENV['SOUNDCLOUD_REDIRECT_URL']
#END initialize

# Initialize Our Application
Falcon.apply( Application )
Finch.listen()