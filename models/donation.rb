class Donation < Sequel::Model
	many_to_one :from_user, :class => :User
	many_to_one :to_user, :class => :User
	one_to_many :charges, :class => :Charge

	def self.allowed_create_columns
		["amount", "frequency", "soundcloud_user_id", "is_anonymous", "message"]
	end

	def self.resolve!(user)
		donations = Donation.filter(:soundcloud_user_id => user.soundcloud_id, :to_user_id => nil)
		
		donations.update(:to_user_id => user.id)

		donations.each{|donation|
			user.add_funds!( donation.charges.sum(:payout_amount) )
		}
	end

	def soundcloud_user_id=(soundcloud_user_id)
		super(soundcloud_user_id)
		self.to_user = User.first(:soundcloud_id => soundcloud_user_id)
	end

	#Has this donation been assigned to a registered Rokk.in user?
	def is_resolved
		!to_user.nil?
	end

	def charge!
		throw Exception.new("Donation has not been saved yet") if self.id.nil?
		throw Exception.new("Donation is no longer active") unless self.is_active

		customer = Balanced::Customer.find(self.from_user.balanced_customer_uri)
		card = Balanced::Card.find(self.from_user.balanced_card_uri)

		debit = Balanced::Debit.new(
			:amount => (self.amount.to_f * 100).to_i,
			:customer_uri => customer.uri,
			:source_uri => card.uri,
			:meta => {:donation_id => self.id}
		).save()

		if self.frequency == "once"
			self.is_active = false
			self.save()
		end

		charge = Charge.new
		charge.amount = self.amount
		charge.balanced_debit_uri = debit.uri
		charge.donation = self
		charge.save()

		return charge
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
		
		validates_presence :amount, :message => "Amount must be present"
		validates_numeric :amount, :message => "Amount must be a numeric value"
		errors.add(:amount , "Amount must be atleast $0.50") if self.amount < 0.5

		validates_presence :frequency, :message => "Frequency must be present"
		validates_includes ["once", "weekly"], :frequency, :message => "Frequency must either be 'once' or 'weekly'"

		validates_presence :soundcloud_user_id, :message => "Soundcloud User ID must be present"

		validates_presence :from_user_id, :message => "From User ID must be present"
	end
end
