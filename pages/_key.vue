<template>
  <div class="start-stream-page">
    <div class="flex flex-col h-screen md:grid md:grid-cols-10 md:flex-none md:h-auto">
      <div class="md:col-span-7">
        <StreamViewer :admin="true" :publisher="publisher" />
      </div>
      <div class="flex-grow md:col-span-3">
        <ChatBox :session="audioSession" />
      </div>
    </div>
  </div>
</template>

<script>
import OT from '@opentok/client'

export default {
  name: 'IndexPage',

  beforeRouteLeave() {
    this.stopBroadcast()
  },

  data() {
    return {
      connect: false,
      connectionData: {
        videoChannel: null,
        audioChannel: null,
        videoToken: null,
        audioToken: null,
      },

      videoSession: null,
      audioSession: null,
      publisher: null,
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

  watch: {
    videoSession(val) {
      if (val) this.startBroadcast()
    }
  },

  mounted() {
    this.initStream()
  },

  beforeDestroy() {
    this.stopBroadcast()
  },

  methods: {
    async initStream() {
      try {
        if (!this.streamKey) return
        const key = this.streamKey
        const { data: session } = await this.$axios.$post(`stream/${key}`)

        if (!session) return;
        const {audioChannel, videoChannel} = session

        const { data: tokenData } = await this.$axios.$post('token', {
          key,
          username: 'admin@skillpaddy.com',
          data: {fullName: 'Admin User'},
          mode: 'PRESENTER'
        })

        if (!tokenData) return;
        const {audioToken, videoToken} = tokenData

        this.connectionData = {audioChannel, videoChannel, audioToken, videoToken}
        this.connectStreams()
      } catch (e) {
        window.console.error('Initialize stream error', e.message)
      }
    },

    connectStreams() {
      try {
        const apiKey = this.apiKey
        const {audioChannel, videoChannel, audioToken, videoToken} = this.connectionData

        const videoSession = OT.initSession(apiKey, videoChannel)
        const audioSession = OT.initSession(apiKey, audioChannel)

        const publisher = OT.initPublisher(
          'publisher',
          {
            insertMode: 'append',
            width: '100%',
            height: '100%',
            showControls: false
          },
          (e) => {
            if (e) window.console.error('publisher error', e)
          }
        );

        // Connect to the session
        videoSession.connect(videoToken, (e) => {
          if (e) return window.console.log('video connection error', e)
          videoSession.publish(publisher, (e) => {
            if (e) window.console.error('publish error', e.message)
            this.publisher = publisher
          })

          this.videoSession = videoSession
        });

        audioSession.connect(audioToken, (e) => {
          if (e) return window.console.log('audio connection error', e)
          audioSession.on('streamCreated', (event) => {
            audioSession.subscribe(event.stream)
          })

          this.audioSession = audioSession
        })
      } catch (e) {
        window.console.error('Connect session error', e.message)
      }
    },

    async startBroadcast() {
      try {
        await this.$axios.$patch(`/stream/${this.streamKey}/broadcast`)
      } catch (e) {
        window.console.error('Start broadcast error', e.message)
      }
    },

    async stopBroadcast() {
      try {
        await this.$axios.$delete(`/stream/${this.streamKey}/broadcast`)
        if (this.videoSession) this.videoSession.disconnect()
        if (this.audioSession) this.audioSession.disconnect()
      } catch (e) {
        window.console.error('Stop broadcast error', e.message)
      }
    }
  }
}
</script>

<style>
.start-stream-page {

}
</style>
