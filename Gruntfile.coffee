###
#=================================================
#
#  Setup
#
#=================================================

Install Ruby
Install Node.js (http://nodejs.org/)
`npm install -g grunt-cli`
`gem install sass`
`gem install haml`
`npm install coffee-script`
`npm install grunt --save-dev`
`npm install grunt-contrib-coffee --save-dev`
`npm install grunt-contrib-copy --save-dev`
`npm install grunt-contrib-uglify --save-dev`
`npm install grunt-contrib-watch --save-dev`
`npm install grunt-contrib-haml --save-dev`
`npm install grunt-contrib-sass --save-dev`

###
module.exports = (grunt) ->
	grunt.loadNpmTasks('grunt-contrib-coffee')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-haml')
	grunt.loadNpmTasks('grunt-contrib-sass')
	grunt.registerTask('default', ['coffee', 'uglify', 'sass', 'haml', 'copy', 'watch'])

	grunt.initConfig
		'pkg': grunt.file.readJSON('package.json')

		'coffee':
			'mobile':
				options:
					join: true
				#END options

				files:
					'public/mobile/js/<%= pkg.name %>.js': [
						"private/coffee/*.coffee"
						"private/mobile/coffee/global.coffee"
						"private/mobile/coffee/*.coffee"
						"private/coffee/models/*.coffee"
						"private/coffee/collections/*.coffee"
						"private/mobile/coffee/views/*.coffee"
						"private/mobile/coffee/init.coffee"
					]
				#END files
			#END coffee:mobile

			'web':
				options:
					join: true
				#END options

				files:
					'public/web/js/<%= pkg.name %>.js': [
						"private/coffee/*.coffee"
						"private/web/coffee/*.coffee"
						"private/coffee/models/*.coffee"
						"private/coffee/collections/*.coffee"
						"private/web/coffee/views/*.coffee"
						"private/web/coffee/widgets/*.coffee"
						"private/web/coffee/init.coffee"
					]
				#END files
			#END coffee:web
		#END coffee

		'uglify':
			'mobile':
				'files':
					'mobile/build/<%= pkg.name %>.min.js': 'public/mobile/js/<%= pkg.name %>.js'
				#END files
			#END uglifY:mobile

			'web':
				'files':
					'public/web/js/<%= pkg.name %>.min.js': 'public/web/js/<%= pkg.name %>.js'
				#END files
			#END uglifY:web
		#END uglify

		'sass':
			'mobile':
				options:
					'noCache': true
					'style': 'compressed'
				#END options

				files:
					'mobile/build/<%= pkg.name %>.min.css': 'private/mobile/sass/<%= pkg.name %>.sass'
				#END files
			#END mobile

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

		'haml':
			options:
				'style': 'ugly'
				'double-quote-attributes': true
				'no-escape-attrs': true
				'require': './haml_helpers.rb'
				'bundleExec': false
			#END options

			'mobile':
				files:
					"mobile/build/index.html": [
						"private/mobile/haml/index.haml" 
						"private/mobile/haml/*.haml"
					]
				#END files
			#END haml:mobile

			'web':
				files:
					"web/views/index.html": [
						"private/web/haml/index.haml"
						"private/web/haml/*.haml"
					]
				#END files
			#END haml:web
		#END haml

		'copy':
			'mobile':
				files: [
					{
						expand: true
						dest: 'mobile/build/'
						filter: 'isFile'
						flatten: true
						src: [
							"public/css/*"
							"public/js/*"
							"public/images/*"
							"public/fonts/*"
						]
					}
				]
			#END copy:mobile

			'web':
				files: [
					{
						expand: true
						dest: 'public/web/css/'
						filter: 'isFile'
						flatten: true
						src: [
							"public/fonts/*"
							"public/css/fontello-codes.css"
							"public/css/fontello.css"
							"public/css/rex-icons-codes.css"
							"public/css/rex-icons.css"
						]
					},{
						expand: true
						dest: 'public/web/images/'
						filter: 'isFile'
						flatten: true
						src: [
							"public/images/*"
						]
					}
				]
			#END copy:web
		#END copy

		'watch':
			'mobile_coffee':
				'files': [
					"private/coffee/*.coffee"
					"private/mobile/coffee/*.coffee"
					"private/coffee/models/*.coffee"
					"private/coffee/collections/*.coffee"
					"private/mobile/coffee/views/*.coffee"		
				]

				'tasks': ['coffee:mobile', 'uglify:mobile']
			#END watch:mobile_coffee

			'mobile_sass':
				'files': [
					"private/sass/mixins/mixins.sass"
					"private/sass/core.sass"
					"private/mobile/sass/*.sass"
				]

				'tasks': ['sass:mobile']
			#END watch:mobile_sass

			'mobile_haml':
				'files': [
					"private/mobile/haml/*.haml"
				]

				'tasks': ['haml:mobile']
			#END watch:mobile_haml

			'mobile_copy':
				'files': [
					"public/css/*.css"
					"public/js/*"
					"public/images/*"
					"public/fonts/*"
				]

				'tasks': ['copy:mobile']
			#END mobile_copy

			'web_coffee':
				'files': [
					"private/coffee/*.coffee"
					"private/web/coffee/*.coffee"
					"private/coffee/models/*.coffee"
					"private/web/coffee/views/*.coffee"		
					"private/coffee/collections/*.coffee"
					"private/web/coffee/widgets/*.coffee"		
				]

				'tasks': ['coffee:web', 'uglify:web']
			#END watch:web_coffee

			'web_sass':
				'files': [
					"private/sass/mixins/mixins.sass"
					"private/sass/core.sass"
					"private/web/sass/*.sass"
				]

				'tasks': ['sass:web']
			#END watch:web_sass

			'web_copy':
				'files': [
					"public/fonts/*"
					"public/css/fontello-codes.css"
					"public/css/fontello.css"
					"public/css/rex-icons-codes.css"
					"public/css/rex-icons.css"
				]

				'tasks': ['copy:web']
			#END web_copy

			'web_haml':
				'files': [
					"private/web/haml/*.haml"
				]

				'tasks': ['haml:web']
			#END watch:mobile_haml
		#END watch
	#END initConfig
#END exports
