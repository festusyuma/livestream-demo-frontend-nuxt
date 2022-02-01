<template>
  <div class="chat-messages py-5 flex flex-col">
    <div
      v-for="(message, id) in messages"
      :key="`message-${id}`"
      class="message w-80"
      :class="[message.mine ? 'mine' : '']"
    >
      <small
        class="text-xs text-gray-500"
        :class="[message.mine ? 'mine text-green-600' : 'text-red-500']"
      >
        {{ message.from }}
      </small>
      <p class="text-xs">{{ message.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatMessages",

  props: {
    session: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      messages: []
    }
  },

  watch: {
    session(session) {
      session.on('signal:msg', (e) => {
        const senderData = JSON.parse(e.from.data)
        const message = JSON.parse(e.data)
        message.mine = e.from.connectionId === session.connection.id
        message.from = senderData.name
        this.messages.push(message)
      })
    }
  }
}
</script>

<style scoped>
.mine {
  margin-left: auto;
  text-align: right;
}
</style>
