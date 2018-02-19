module.exports = {


  /*
  ** Headers of the page
  */
  loading: { color: 'green' },
  head: {
    title: 'Spotify Library Janitor',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '{{ description }}' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
    css: [
        '@/assets/main.css',

    ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
    router: {
        middleware: 'i18n'
    },
    plugins: ['~/plugins/i18n.js','~/plugins/vue-spotify.js'],
    generate: {
        routes: ['/', '/about', '/fr', '/fr/about']
    }

}
