RokkIn::Web.helpers do
 	def ko(expression, &block)
 		with_raw_haml_concat do
	 		if block
				haml_concat( "<!-- ko #{expression} -->" )
				block.call
				haml_concat( "<!-- /ko -->" )
			else
				haml_concat( "<!-- ko #{expression} --><!-- /ko -->" )
			end
		end
	end
end