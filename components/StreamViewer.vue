<template>
  <div class="stream-viewer relative flex flex-col bg-black md:h-screen md: p-0">
    <div class="publisher-cover my-auto">
      <div class="w-full relative pt-[56.25%]">
        <div v-if="admin" id="publisher" class="viewer">
        </div>
        <div
          v-else
          class="video-container viewer"
        >
          <video
            id="videojs-player"
            ref="videoElem"
            playsinline
          >
          </video>
          <div id="audio-publisher"></div>
        </div>
        <div id="streams"></div>
      </div>
      <div
        v-if="admin && publisher"
        class="text-center flex z-50 py-3 px-1 absolute bottom-0 right-0"
      >
        <button class="control icon" @click="controls.video = !controls.video">
          <fa-icon v-if="controls.video" :icon="['fas', 'video']"></fa-icon>
          <fa-icon v-else :icon="['fas', 'video-slash']"></fa-icon>
        </button>
        <button class="control icon" @click="controls.mic = !controls.mic">
          <fa-icon v-if="controls.mic" :icon="['fas', 'microphone-alt']"></fa-icon>
          <fa-icon v-else :icon="['fas', 'microphone-alt-slash']"></fa-icon>
        </button>
        <button class="control icon" @click="controls.audio = !controls.audio">
          <fa-icon v-if="controls.audio" :icon="['fas', 'volume-up']"></fa-icon>
          <fa-icon v-else :icon="['fas', 'volume-mute']"></fa-icon>
        </button>
        <button class="control icon" @click="disconnect">
          <fa-icon :class="[disconnectLoading ? 'spin' : '']" :icon="['fas', 'phone-slash']"></fa-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  create,
  // ErrorType,
  isPlayerSupported,
  // MediaPlayer,
  // PlayerError,
  PlayerEventType,
  // PlayerState,
  // Quality,
  // TextCue,
  // TextMetadataCue,
} from 'amazon-ivs-player';

export default {
  name: "StreamViewer",

  props: {
    admin: {
      type: Boolean,
      default: false
    },
    broadcaster: {
      type: Object,
      default: null
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
      disconnectLoading: false,
      ivs: null,
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
    },
    broadcaster(val) {
      if (val) this.initBroadcast()
    },
    videoElem(val) {
      window.console.log(val)
    }
  },

  mounted() {
    if (!isPlayerSupported) this.$toast.error('Browser not supported')
    if (!this.admin && this.broadcaster) this.initBroadcast()
  },

  methods: {
    initBroadcast() {
      const player = create({
        wasmBinary: '/_nuxt/amazon-ivs-wasmworker.min.wasm',
        wasmWorker: '/_nuxt/amazon-ivs-wasmworker.min.js'
      })

      player.attachHTMLVideoElement(this.$refs.videoElem)
      player.setAutoplay(true)
      player.load(this.broadcaster.broadcastUrl);

      player.addEventListener(PlayerEventType.QUALITY_CHANGED, this.qualityChangeListener)
      player.addEventListener(PlayerEventType.INITIALIZED, () => {
        window.console.log(player)
        window.console.log((player.getState()))
        window.console.log(player.getQualities())
      })

      window.console.log(this.broadcaster)
    },

    qualityChangeListener(quality) {
      window.console.log('QUALITY_CHANGED', quality);
    },

    disconnect() {
      this.$emit('disconnect')
    }
  }
}
</script>

<style lang="scss" scoped>
.control {
  @apply mx-1 md:mx-2;
}

.viewer {
  @apply absolute top-0 left-0 bottom-0 right-0 w-full md:rounded-md md:overflow-hidden;
  video {
    @apply w-full h-full;
  }

  #audio-publisher {
    @apply hidden;
  }
}

#streams {
  @apply hidden;
}
</style>
