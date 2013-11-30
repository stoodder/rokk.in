class Charge < Sequel::Model
	many_to_one :donation, :class => :Donation

	def amount
		self.payout_amount + self.credit_card_fee
	end

	def amount=(amount)
		self.credit_card_fee = amount*0.029 + 0.30
		self.payout_amount = amount - self.credit_card_fee
	end

	def before_save
		self.created_at ||= Time.now.utc
		self.updated_at = Time.now.utc
		super
	end
	
    include Shield::Model
	plugin :validation_helpers

	def validate
		super
		
		validates_presence :balanced_debit_uri, :message => "Balanced Debit Uri must be present"
	end
end
