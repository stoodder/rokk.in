class User < Sequel::Model

	def self.allowed_create_column
		[]
	end

	def self.allowed_update_column
		['full_name', 'avatar_url']
	end

	def soundcloud_user=(soundcloud_user)
		self.soundcloud_id = soundcloud_user.id
		self.full_name = soundcloud_user.full_name
		self.avatar_url = soundcloud_user.avatar_url
	end
	
    include Shield::Model
	plugin :validation_helpers

	def validate
		super
		
		validates_presence :full_name
		validates_presence :soundcloud_id

		validates_unique :soundcloud_id
	end
end
