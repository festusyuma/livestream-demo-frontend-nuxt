import CopyPlugin from "copy-webpack-plugin";

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'livestream-demo-frontend-nuxt',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/global', ssr: false, },
    { src: '~plugins/is-json', ssr: false, },
    { src: '~plugins/axios', ssr: false, },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxt/postcss8',
    '@nuxtjs/fontawesome',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/toast',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.BASE_URL,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },

    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.*',
            to: '[name].[ext]'
          }
        ]
      })
    ]
  },

  toast: {
    position: 'top-center',
    duration: 10000,
  },

  fontawesome: {
    icons: {
      solid: [
        'faCircleNotch',
        'faVideo',
        'faVideoSlash',
        'faMicrophone',
        'faMicrophoneAlt',
        'faMicrophoneAltSlash',
        'faPhoneSlash',
        'faVolumeUp',
        'faVolumeMute',
      ],
      regular: [
        'faPaperPlane'
      ],
      brands: [],
    },
    component: 'Fa',
    suffix: true,
  },

  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0'
  },

  env: {
    BASE_URL: process.env.BASE_URL || 'https://api.livestream.festusyuma.com',
    OPENTOK_API_KEY: process.env.OPENTOK_API_KEY,
  }
}
