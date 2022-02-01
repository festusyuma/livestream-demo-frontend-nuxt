<template>
  <div class="stream-viewer relative h-screen flex flex-col bg-black">
    <div class="publisher-cover my-auto">
      <div id="publisher" class="w-full aspect-video rounded-md overflow-hidden">
      </div>
      <template v-if="admin">
        <div class="absolute bottom-5 right-3 text-center flex z-50">
          <button class="control icon" @click="controls.video = !controls.video">
            <fa-icon v-if="controls.video" :icon="['fas', 'video']"></fa-icon>
            <fa-icon v-else :icon="['fas', 'video-slash']"></fa-icon>
          </button>
          <button class="control icon" @click="controls.audio = !controls.audio">
            <fa-icon v-if="controls.audio" :icon="['fas', 'microphone-alt']"></fa-icon>
            <fa-icon v-else :icon="['fas', 'microphone-alt']"></fa-icon>
          </button>
        </div>
      </template>
    </div>
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
  margin: 0 0.5rem;
}
</style>
