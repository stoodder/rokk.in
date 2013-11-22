RokkIn::App.helpers do
	def json
        @json = JSON.parse(request.body.read) if @json.nil?
		return @json
	end

	# Fetches a single model of class with id. 
	# Returns the model or halts the request error 404 if its nil.
	# usage:
	# => klass_inst = fetch(Klass, id)
	def fetch(klass, id)
		ret = klass[id.to_i]
		error_response(404, "#{klass.to_s} for id #{id} not found.") if ret.nil?
		ret
	end
end
