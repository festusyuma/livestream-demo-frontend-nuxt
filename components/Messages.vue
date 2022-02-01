<template>
  <div class="chat-messages">
    <div
      v-for="(message, id) in messages"
      :key="`message-${id}`"
      class="message">
      {{ message.text }}
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
  }
}
</script>

<style scoped>

</style>
