object @user
extends "user/one", :locals => {:show_full_user => true}

node :soundcloud_access_token do
	session[:soundcloud_access_token]
end