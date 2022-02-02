<template>
  <div class="chat-box bg-[#f8f8f8] rounded-md flex flex-col p-3.5 min-h-full max-h-full">
    <Messages class="flex-grow overflow-y-auto" :session="session" />
    <div class="new-message mt-auto flex-shrink-0">
      <form class="w-full" @submit="sendMessage">
        <input v-model="message" type="text" class="w-full px-3 py-2" placeholder="Send message" />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatBox",

  props: {
    session: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      message: ''
    }
  },

  watch: {
    session(val) {
      window.console.log(val)
    }
  },

  methods: {
    sendMessage(e) {
      e.preventDefault()

      const data = JSON.stringify({
        message: this.message,
        timestamp: '9:03am'
      })

      this.session.signal({ data, type: 'msg' }, (e) => {
        if (e) this.$toast.error(e.message)
        else this.message = ''
      })
    }
  }
}
</script>

<style scoped>
</style>
