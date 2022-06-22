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
        videoChannel: '2_MX40NzUyNTc4MX5-MTY1NTkwMTAyMTM1NX4wNUcrcGY1N09YaWtIMlcwNklnS0RUVWd-fg',
        audioChannel: '2_MX40NzUyNTc4MX5-MTY1NTkwMTAyMjk2MX5KNEdDb05nZ3llaFdOMk40OVlhNUpvbi9-UH4',
        audioToken: 'T1==cGFydG5lcl9pZD00NzUyNTc4MSZzaWc9Y2JiMWNhY2U2ZGU0OTIxMDc3NjFmYWIzMmU0NmU1ZjJhYmZjMDc5ODpzZXNzaW9uX2lkPTJfTVg0ME56VXlOVGM0TVg1LU1UWTFOVGt3TVRBeU1qazJNWDVLTkVkRGIwNW5aM2xsYUZkT01rNDBPVmxoTlVwdmJpOS1VSDQmY3JlYXRlX3RpbWU9MTY1NTkwMTAyNSZub25jZT0wLjMxNDcwODYxNTg5Nzk0NTc0JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE2NTY1MDU4MjQ2NzgmY29ubmVjdGlvbl9kYXRhPSU3QiUyMmlkJTIyJTNBMjMlMkMlMjJ1c2VybmFtZSUyMiUzQSUyMkZlc3R1c3l1bWElMjIlMkMlMjJmdWxsTmFtZSUyMiUzQSUyMkZlc3R1cyUyMEFnYm9tYSUyMiU3RCZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PWZvY3Vz',
        videoToken: 'T1==cGFydG5lcl9pZD00NzUyNTc4MSZzaWc9OWExMzIxOWQ0M2ZmYzQ5NGMzZDc5NGMxM2FiMzM3NDYxZTU5MjVmNTpzZXNzaW9uX2lkPTJfTVg0ME56VXlOVGM0TVg1LU1UWTFOVGt3TVRBeU1UTTFOWDR3TlVjcmNHWTFOMDlZYVd0SU1sY3dOa2xuUzBSVVZXZC1mZyZjcmVhdGVfdGltZT0xNjU1OTAxMDI1Jm5vbmNlPTAuNTQyODExNDc3MTEzNzg1MSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjU2NTA1ODI0Njc5JmNvbm5lY3Rpb25fZGF0YT0lN0IlMjJpZCUyMiUzQTIzJTJDJTIydXNlcm5hbWUlMjIlM0ElMjJGZXN0dXN5dW1hJTIyJTJDJTIyZnVsbE5hbWUlMjIlM0ElMjJGZXN0dXMlMjBBZ2JvbWElMjIlN0QmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD1mb2N1cw=='
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
