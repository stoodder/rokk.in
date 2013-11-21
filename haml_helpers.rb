module Haml::Helpers
 	def ko(expression, &block)
 		if block
			haml_concat( "<!-- ko #{expression} -->" )
			block.call
			haml_concat( "<!-- /ko -->" )
		else
			haml_concat( "<!-- ko #{expression} --><!-- /ko -->" )
		end
	end
end