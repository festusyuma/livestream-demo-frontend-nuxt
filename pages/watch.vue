<template>
  <div class="watch-stream h-screen">
    <div v-if="!registered" class="detail-form-cover flex flex-col justify-center h-screen">
      <div class="details-form mx-auto bg-gray-100 rounded-md py-20 px-10">
        <h4 class="text-center text-xl font-medium mb-10">Enter Details</h4>
        <form @submit="watchStream">
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
    <div v-else class="grid grid-cols-10">
      <div class="col-span-7">
        <StreamViewer :publisher="publisher" />
      </div>
      <div class="col-span-3">
        <ChatBox :session="session" />
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
      token: null,
      session: null,
      publisher: null,
      loading: false,
      user: {
        fullName: '',
        phoneNumber: ''
      }
    }
  },

  async fetch() {
  },

  methods: {
    async watchStream(e) {
      e.preventDefault()
      const { fullName, phoneNumber } = this.user
      this.loading = true

      try {
        const res = await this.$axios.$post('/opentok/join', {
          fullName,
          phoneNumber
        })

        if (res.success) {
          const { apiKey, sessionId, token } = res.data
          this.token = token
          this.registered = true
          this.initStream(apiKey, sessionId, token)
          this.$toast.success('Steam connected, please be respectful in the comment section')
        }
      } catch (e) {
        window.console.error(e)
      }

      this.loading = false
    },

    initStream(apiKey, sessionId, token) {
      try {
        const session = OT.initSession(apiKey, sessionId)

        session.on('streamCreated', (event) => {
          this.publisher = session.subscribe(event.stream, 'publisher', {
            insertMode: 'append',
            width: '100%',
            height: '100%',
            showControls: false,
            subscribeToAudio: true
          }, this.handleError)
        });

        // Connect to the session
        session.connect(token, function(error) {
          if (error) this.handleError(error);
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

<style scoped>

</style>
