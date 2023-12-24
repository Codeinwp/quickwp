/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [ './src/style.scss', './src/*.js', './src/**/*.js' ],
	theme: {
		extend: {
			colors: {
				bg: '#000000',
				fg: '#FFFFFF'
			},
			maxHeight: {
				'80vh': '80vh'
			}
		}
	},
	plugins: []
};
