/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [ './src/style.scss', './src/*.js', './src/**/*.js' ],
	theme: {
		extend: {
			aspectRatio: {
				vert: '3/4'
			},
			colors: {
				bg: '#000000',
				fg: '#FFFFFF',
				secondary: '#232323',
				'bg-alt': '#2F2F2F',
				'fg-alt': '#E0E0E0',
				active: '#4663F8'
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
