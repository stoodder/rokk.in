RokkIn::App.helpers do
    def error_response(code, message, options={})
		error code, error_builder(message, options).to_json
	end

	def verify!(object)
		object.valid?
		yield object if block_given?
		error_response(400, "#{object.class.to_s} is not valid", :validations=>object.errors) unless object.errors.empty?
	end

	def error_builder(message, options)
		defualts = {
			:human=>message || "An error occured. Please contact #{ENV['SUPPORT_EMAIL']} with the details.",
			:error=>message,
			:validations=>nil
		}
		data = defualts.merge options
		data
	end
end
