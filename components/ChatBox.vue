<template>
  <div class="chat-box h-full bg-[#f8f8f8] rounded-b-sm flex flex-col p-2">
    <Messages class="flex-grow overflow-y-auto"  />
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

  methods: {
    sendMessage() {

    }
  }
}
</script>

<style scoped>

</style>
