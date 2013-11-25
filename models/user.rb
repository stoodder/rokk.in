class User < Sequel::Model

	def self.allowed_create_columns
		[]
	end

	def self.allowed_update_columns
		['full_name', 'avatar_url']
	end

	def soundcloud_user=(soundcloud_user)
		self.soundcloud_id = soundcloud_user.id
		self.full_name = soundcloud_user.full_name
		self.avatar_url = soundcloud_user.avatar_url
	end

	def create_balanced_customer!
		balanced_customer = Balanced::Customer.new
		balanced_customer.name = self.full_name
		balanced_customer.meta = {rokkin_id: self.id}
		self.balanced_customer_uri = (balanced_customer.save).uri
		self.save()
	end

	def remove_credit_card!
		if self.balanced_card_uri
			#Remove the card from balanced
			Balanced::Card.find(self.balanced_card_uri).unstore

			#Update our internal data
			self.balanced_card_uri = nil
			self.card_last_4 = nil
			self.card_type = nil
			self.card_expiration_month = nil
			self.card_expiration_year = nil

			#Save ourselves
			self.save()
		end
	end

	def set_balanced_card_uri!(card_uri)
		#Add the card on balanced
		customer = Balanced::Customer.find(self.balanced_customer_uri)
		customer.add_card(card_uri)
		card = Balanced::Card.find(card_uri)

		#Remove the Previous Card
		Balanced::Card.find(self.balanced_card_uri).unstore if self.balanced_card_uri

		#Update our internal data
		self.balanced_card_uri = card.uri
		self.card_last_4 = card.last_four
		self.card_type = card.brand
		self.card_expiration_month = card.expiration_month
		self.card_expiration_year = card.expiration_year

		#Save ourselves
		self.save()
	end
	
    include Shield::Model
	plugin :validation_helpers

	def before_save
		self.created_at ||= Time.now.utc
		self.updated_at = Time.now.utc
		super
	end

	def validate
		super
		
		validates_presence :full_name
		validates_presence :soundcloud_id

		validates_unique :soundcloud_id
	end
end
