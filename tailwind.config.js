/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [ './src/style.scss', './src/*.js', './src/**/*.js' ],
	theme: {
		extend: {
			aspectRatio: {
				vert: [ 3, 4 ]
			},
			boxShadow: {
				selected: '-3px 3px 0px -1px #000'
			},
			colors: {
				bg: '#000000',
				fg: '#FFFFFF',
				secondary: '#232323'
			},
			maxHeight: {
				'md': '32rem',
				'40vh': '40vh',
				'80vh': '80vh'
			}
		}
	},
	plugins: []
};
