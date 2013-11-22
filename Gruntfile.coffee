###
#=================================================
#
#  Setup
#
#=================================================

Install Ruby
Install Node.js (http://nodejs.org/)
npm install -g grunt-cli
gem install sass
gem install haml
npm install coffee-script
npm install grunt --save-dev
npm install grunt-contrib-coffee --save-dev
npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-watch --save-dev
npm install grunt-contrib-concat --save-dev
npm install grunt-contrib-sass --save-dev

###
module.exports = (grunt) ->
	grunt.loadNpmTasks('grunt-contrib-coffee')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-haml')
	grunt.loadNpmTasks('grunt-contrib-sass')
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.registerTask('default', ['coffee', 'uglify', 'sass', 'concat', 'watch'])

	grunt.initConfig
		'pkg': grunt.file.readJSON('package.json')

		'coffee':
			'web':
				options:
					join: true
				#END options

				files:
					'public/web/js/<%= pkg.name %>.js': [
						"private/coffee/*.coffee"
						
						"private/coffee/models/soundcloud_model.model.coffee"
						"private/coffee/models/*.coffee"

						"private/coffee/collections/soundcloud_collection.collection.coffee"
						"private/coffee/collections/*.coffee"

						"private/web/coffee/views/*.coffee"
						
						"private/web/coffee/bindings/*.coffee"

						"private/web/coffee/routes.coffee"
						"private/web/coffee/init.coffee"
					]
				#END files
			#END coffee:web
		#END coffee

		'uglify':
			'web':
				'files':
					'public/web/js/<%= pkg.name %>.min.js': 'public/web/js/<%= pkg.name %>.js'
				#END files
			#END uglifY:web
		#END uglify

		'sass':
			'web':
				options:
					'noCache': true
					'style': 'compressed'
				#END options

				files:
					'public/web/css/<%= pkg.name %>.min.css': 'private/web/sass/<%= pkg.name %>.sass'
				#END files
			#END mobile
		#END sass

		'concat':
			'web':
				files:
					"web/views/index.haml": [
						"private/web/haml/index.haml"
						"private/web/haml/*.haml"
					]
				#END files
			#END concat:web
		#END concat

		'watch':
			'web_coffee':
				'files': [
					"private/coffee/*.coffee"
					"private/coffee/models/*.coffee"
					"private/coffee/collections/*.coffee"
					
					"private/web/coffee/*.coffee"
					"private/web/coffee/views/*.coffee"
					"private/web/coffee/bindings/*.coffee"
				]

				'tasks': ['coffee:web', 'uglify:web']
			#END watch:web_coffee

			'web_sass':
				'files': [
					"private/sass/*.sass"
					"private/web/sass/*.sass"
				]

				'tasks': ['sass:web']
			#END watch:web_sass

			'web_concat':
				'files': ["private/web/haml/*.haml"]

				'tasks': ['concat:web']
			#END watch:mobile_haml
		#END watch
	#END initConfig
#END exports
