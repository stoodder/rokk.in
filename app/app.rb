module RokkIn
  class App < Padrino::Application
    register Padrino::Rendering
    register Padrino::Mailer
    register Padrino::Helpers

    enable :sessions

     Oj.default_options = {
        :time_format => :ruby
    }

    use Rack::Cors do
        allow do
            origins '*'
            resource '*', :headers => :any, :methods => [:get, :post, :put, :options, :delete]
        end
    end

    Rabl.configure do |config|
        # Commented as these are defaults
        # config.cache_all_output = false
        config.include_json_root = false
        config.include_child_root = false
    end
  end
end
