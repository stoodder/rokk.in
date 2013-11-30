object @donation
attributes :amount, :frequency, :soundcloud_user_id, :message, :is_active, :is_anonymous

child :from_user => :from_user do |from_user|
	extends "user/one"
end

child :to_user => :to_user do |to_user|
	extends "user/one"
end