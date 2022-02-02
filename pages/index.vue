<template>
  <div class="start-stream-page">
    <div class="flex flex-col h-screen md:grid md:grid-cols-10 md:flex-none md:h-auto">
      <div class="md:col-span-7">
        <StreamViewer :admin="true" :publisher="publisher" />
      </div>
      <div class="flex-grow md:col-span-3">
        <ChatBox :session="session" />
      </div>
    </div>
  </div>
</template>

<script>
import OT from '@opentok/client'

export default {
  name: 'IndexPage',

  data() {
    return {
      token: null,
      session: null,
      publisher: null,
    }
  },

  async fetch() {
    await this.startStream()
  },

  methods: {
    async startStream() {
      try {
        const res = await this.$axios.$get('/opentok/stream')
        if (res.success) {
          const { apiKey, sessionId, token } = res.data
          this.token = token
          this.initStream(apiKey, sessionId, token)
        }
      } catch (e) {
        window.console.error(e)
      }
    },

    initStream(apiKey, sessionId, token) {
      try {
        const session = OT.initSession(apiKey, sessionId)

        const publisher = OT.initPublisher('publisher', {
          insertMode: 'append',
          width: '100%',
          height: '100%',
          showControls: false
        }, (e) => window.console.log(e));
        this.publisher = publisher

        // Connect to the session
        session.connect(token, function(error) {
          if (error) this.handleError(error);
          else session.publish(publisher, (e) => {
            if (e) this.$toast.error(e.message)
          })
        });

        this.session = session
      } catch (e) {
        window.console.log(e)
      }
    },

    handleError(e) {
      if (e) {
        window.console.log(e)
      }
    }
  }
}
</script>

<style>
.start-stream-page {

}
</style>
