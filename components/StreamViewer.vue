<template>
  <div class="stream-viewer relative flex flex-col bg-black md:h-screen md: p-0">
    <div class="publisher-cover my-auto">
      <div class="w-full relative pt-[60%]">
        <div id="publisher" class="absolute top-0 left-0 bottom-0 right-0 w-full md:rounded-md md:overflow-hidden">
        </div>
      </div>
      <div class="text-center flex z-50 py-3 px-1 absolute bottom-0 right-0">
        <template v-if="admin">
          <button class="control icon" @click="controls.video = !controls.video">
            <fa-icon v-if="controls.video" :icon="['fas', 'video']"></fa-icon>
            <fa-icon v-else :icon="['fas', 'video-slash']"></fa-icon>
          </button>
          <button class="control icon" @click="controls.mic = !controls.mic">
            <fa-icon v-if="controls.mic" :icon="['fas', 'microphone-alt']"></fa-icon>
            <fa-icon v-else :icon="['fas', 'microphone-alt-slash']"></fa-icon>
          </button>
        </template>
        <template v-else>
          <button class="control icon" @click="controls.audio = !controls.audio">
            <fa-icon v-if="controls.audio" :icon="['fas', 'volume-up']"></fa-icon>
            <fa-icon v-else :icon="['fas', 'volume-mute']"></fa-icon>
          </button>
        </template>
        <button class="control icon" @click="disconnect">
          <fa-icon :class="[disconnectLoading ? 'spin' : '']" :icon="['fas', 'phone-slash']"></fa-icon>
        </button>
      </div>
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
        mic: true,
        audio: true
      },
      disconnectLoading: false
    }
  },

  watch: {
    controls: {
      deep: true,
      handler(val) {
        if (this.admin) {
          this.publisher.publishVideo(val.video)
          this.publisher.publishAudio(val.mic)
        } else {
          this.publisher.subscribeToAudio(val.audio)
        }
      }
    }
  },

  methods: {
    disconnect() {

    }
  }
}
</script>

<style scoped>
.control {
  @apply mx-1 md:mx-2;
}
</style>
