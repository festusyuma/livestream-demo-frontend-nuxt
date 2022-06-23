<template>
  <div class="watch-stream-page">
    <div v-if="!registered" class="detail-form-cover flex flex-col justify-center h-screen w-full">
      <div class="details-form mx-auto bg-gray-100 rounded-md py-20 px-10">
        <h4 class="text-center text-xl font-medium mb-10">Enter Details</h4>
        <form @submit="watchStream">
          <div class="input-group">
            <input v-model="user.email" type="email" placeholder="Email" title="email" />
          </div>
          <div class="input-group">
            <input v-model="user.phoneNumber" type="tel" placeholder="Phone Number" title="phone number" />
          </div>
          <div class="input-group">
            <input v-model="user.fullName" type="text" placeholder="Full Name" title="full name" />
          </div>
          <div class="flex justify-end">
            <button>
              Submit
              <span v-if="loading" class="icon">
                <fa-icon class="spin" :icon="['fas', 'circle-notch']"></fa-icon>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-else class="flex flex-col h-screen md:grid md:grid-cols-10 md:flex-none md:h-auto">
      <div class="md:col-span-7">
        <StreamViewer :broadcaster="broadcaster" />
      </div>
      <div class="flex-grow md:col-span-3">
        <ChatBox :session="audioSession" />
      </div>
    </div>
  </div>
</template>

<script>
import OT from "@opentok/client";

export default {
  name: "WatchStream",

  data() {
    return {
      registered: false,
      loading: false,
      audioSession: null,
      publisher: null,
      connectionData: {
        audioChannel: null,
        audioToken: null,
      },
      broadcaster: null,
      user: {
        email: '',
        fullName: '',
        phoneNumber: ''
      },
    }
  },

  computed: {
    streamKey() {
      return this.$route.params.key
    },
    apiKey() {
      return process.env.OPENTOK_API_KEY
    }
  },

  mounted() {
    const userData = window.localStorage.getItem('userData')
    if (userData) this.user = JSON.parse(userData)
  },

  methods: {
    async watchStream(e) {
      e.preventDefault()

      if (this.loading) return
      this.loading = true

      window.localStorage.setItem('userData', JSON.stringify(this.user))
      const { fullName, phoneNumber, email } = this.user

      try {
        const {data: tokenData} = await this.$axios.$post('/token', {
          key: this.streamKey,
          username: email,
          data: {name: fullName, phoneNumber, email},
          mode: 'VIEWER'
        })

        if (!tokenData) return
        const {
          audioToken, videoToken,
          session: {audioChannel, broadcast: {broadcastUrl}}
        } = tokenData

        this.registered = true
        this.connectionData = {audioChannel, audioToken}
        this.broadcaster = {videoToken, broadcastUrl}
        this.$toast.success('Steam connected, please be respectful in the comment section')
        this.initStream()
      } catch (e) {
        window.console.error(e)
      } finally {
        this.loading = false
      }
    },

    initStream() {
      try {
        const {audioChannel, audioToken} = this.connectionData
        const audioSession = OT.initSession(this.apiKey, audioChannel)

        // Connect to the session
        audioSession.connect(audioToken, (e) => {
          if (e) window.console.error(e);

          const publisher = OT.initPublisher(
            'audio-publisher',
            {
              publishAudio: true,
              publishVideo: false,
              showControls: false
            },
            (e) => {
              if (e) window.console.error(e)
            }
          )

          audioSession.on('streamCreated', (event) => {
            audioSession.subscribe(event.stream, 'streams')
          })

          audioSession.publish(publisher, (e) => {
            if (e) return window.console.log('audio connection error', e)
            this.publisher = publisher
          })

          this.audioSession = audioSession
        });
      } catch (e) {
        window.console.log(e)
      }
    },

    disconnect() {
      if (this.audioSession) {
        this.audioSession.disconnect()
      }
    }
  }
}
</script>

<style scoped>

</style>
