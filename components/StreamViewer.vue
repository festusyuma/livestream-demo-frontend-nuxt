<template>
  <div class="stream-viewer relative">
    <div id="publisher" class="w-full aspect-video rounded-md overflow-hidden">
    </div>
    <template v-if="admin">
      <div class="absolute bottom-5 right-3 text-center flex z-50">
        <button class="control" @click="controls.video = !controls.video">V</button>
        <button class="control" @click="controls.audio = !controls.audio">A</button>
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
  },

  data() {
    return {
      controls: {
        video: true,
        audio: true
      }
    }
  },

  watch: {
    controls: {
      deep: true,
      handler(val) {
        this.publisher.publishVideo(val.video)
        this.publisher.publishAudio(val.audio)
      }
    }
  },

  methods: {
  }
}
</script>

<style scoped>
.control {
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  background: #343434;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.5rem;
}

.control:hover {
  cursor: pointer;
}
</style>
