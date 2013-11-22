object @user
extends "user/one"

node :soundcloud_access_token do
	session[:soundcloud_access_token]
end