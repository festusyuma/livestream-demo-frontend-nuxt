<template>
  <div class="start-stream-page">
    <div class="flex flex-col h-screen md:grid md:grid-cols-10 md:flex-none md:h-auto">
      <div class="md:col-span-7">
        <StreamViewer :admin="true" :publisher="publisher" />
      </div>
      <div class="flex-grow md:col-span-3">
        <ChatBox :session="videSession" />
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
      connect: false,
      connectionData: {
        apiKey: '47525781',
        videoChannel: '1_MX40NzUyNTc4MX5-MTY1NTkwMjkwNzk1NH5uc3JnV1hLMVZkUFNSc2htdHFIcmxyUyt-fg',
        audioChannel: '2_MX40NzUyNTc4MX5-MTY1NTkwMjkwODg3N34waEJZR09nMGR2Y1h4ZG5hN21YRFJLenB-UH4',
        videoToken: 'T1==cGFydG5lcl9pZD00NzUyNTc4MSZzaWc9ZmE3OWFlZmRiYjc5MjJmYzI4Nzk2ZThhYzAxODJjODFjMDc2MzJlMzpzZXNzaW9uX2lkPTFfTVg0ME56VXlOVGM0TVg1LU1UWTFOVGt3TWprd056azFOSDV1YzNKblYxaExNVlprVUZOU2MyaHRkSEZJY214eVV5dC1mZyZjcmVhdGVfdGltZT0xNjU1OTAyOTE3Jm5vbmNlPTAuMDU5MTc5MjU4NjI0MDIxNCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjU2NTA3NzE2NjY1JmNvbm5lY3Rpb25fZGF0YT0lN0IlMjJpZCUyMiUzQTIzJTJDJTIydXNlcm5hbWUlMjIlM0ElMjJGZXN0dXN5dW1hJTIyJTJDJTIyZnVsbE5hbWUlMjIlM0ElMjJGZXN0dXMlMjBBZ2JvbWElMjIlN0QmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD1mb2N1cw==',
        audioToken: 'T1==cGFydG5lcl9pZD00NzUyNTc4MSZzaWc9NDk1YzM0OWViNjVhMWMyN2I5NWNjNmFhZWM5ZGU3MTZmZmNmYjI3OTpzZXNzaW9uX2lkPTJfTVg0ME56VXlOVGM0TVg1LU1UWTFOVGt3TWprd09EZzNOMzR3YUVKWlIwOW5NR1IyWTFoNFpHNWhOMjFZUkZKTGVuQi1VSDQmY3JlYXRlX3RpbWU9MTY1NTkwMjkxNyZub25jZT0wLjY2OTY5MDQxNzMzNjA5MTQmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTY1NjUwNzcxNjYxMyZjb25uZWN0aW9uX2RhdGE9JTdCJTIyaWQlMjIlM0EyMyUyQyUyMnVzZXJuYW1lJTIyJTNBJTIyRmVzdHVzeXVtYSUyMiUyQyUyMmZ1bGxOYW1lJTIyJTNBJTIyRmVzdHVzJTIwQWdib21hJTIyJTdEJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9Zm9jdXM=',
      },

      videSession: null,
      audioSession: null,
      publisher: null,
    }
  },

  mounted() {
    this.initStream()
  },

  methods: {
    initStream() {
      try {
        const {apiKey, videoChannel, videoToken} = this.connectionData
        const videoSession = OT.initSession(apiKey, videoChannel)

        const publisher = OT.initPublisher(
          'publisher',
          {
            insertMode: 'append',
            width: '100%',
            height: '100%',
            showControls: false
          },
          (e, res) => {
            window.console.log('publisher error', e)
            window.console.log('publisher res', e)
          }
        );
        this.publisher = publisher

        // Connect to the session
        videoSession.connect(videoToken, (e, res) => {
          window.console.log('connection error', e)
          window.console.log('connection res', e)
          if (!e) {
            videoSession.publish(publisher, (e, res) => {
              window.console.log('publish error', e)
              window.console.log('publish res', res)
            })
          }
        });

        this.videSession = videoSession
      } catch (e) {
        window.console.log(e)
      }
    },
  }
}
</script>

<style>
.start-stream-page {

}
</style>
