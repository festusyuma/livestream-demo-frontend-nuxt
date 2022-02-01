<template>
  <div class="stream-viewer relative">
    <div id="publisher" class="w-full aspect-video rounded-md overflow-hidden">
    </div>
    <template v-if="admin">
      <div class="absolute bottom-5 text-center flex">
        <button>Video</button>
        <button>Audio</button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "StreamViewer",

  props: {
    admin: {
      type: Boolean,
      default: false
    },
    publisher: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>

</style>
