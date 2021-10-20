<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 my-3">
        <h2>Room</h2>
        <input v-model="roomId" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="">
          <p2p
            ref="p2p"
            width="100%"
            :roomId="roomId"
            :enableAudio="true"
            v-on:joined-room="logEvent"
            v-on:left-room="logEvent"
            v-on:opened-room="logEvent"
            v-on:share-started="logEvent"
            v-on:share-stopped="logEvent"
            @error="onError"
          />
        </div>
        <div class="row">
          <div class="col-md-12 my-3">
            <button type="button" class="btn btn-primary" @click="onJoin">
              Join
            </button>
            <button type="button" class="btn btn-primary" @click="onLeave">
              Leave
            </button>
            <button type="button" class="btn btn-primary" @click="onCapture">
              Capture Photo
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="onShareScreen"
            >
              Share Screen
            </button>
            <button type="button" class="btn btn-primary" @click="onCamera">
              Camera
            </button>
            <button type="button" class="btn btn-primary" @click="onMuted">
              Mic
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="img">
      <div class="col-md-12">
        <h2>Captured Image</h2>
        <figure class="figure">
          <img :src="img" class="img-responsive" />
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import p2p from "@/components/Peer2Peer.vue";
export default {
  name: "Home",
  components: { p2p },
  data() {
    return {
      img: null,
      roomId: "public-room-v2",
      cameraActive: false,
    };
  },
  methods: {
    onCapture() {
      this.img = this.$refs.p2p.capture();
    },
    onJoin() {
      this.$refs.p2p.join();
    },
    onLeave() {
      this.$refs.p2p.leave();
    },
    onShareScreen() {
      this.img = this.$refs.p2p.shareScreen();
    },
    onCamera() {
      console.log(this.cameraActive);
      if (this.cameraActive) {
        this.cameraActive = !this.cameraActive;
        const video = document.querySelector("video");
        const mediaStream = video.srcObject;
        const tracks = mediaStream.getTracks();
        this.$refs.p2p.cameraOff(tracks);
      } else {
        this.cameraActive = true;
        this.$refs.p2p.startCamera();
      }
    },
    onMuted() {
      this.$refs.p2p.micToggle()
    },
    onError(error, stream) {
      console.log("On Error Event", error, stream);
    },
    logEvent(event) {
      console.log("Event : ", event);
    },
  },
  created() {},
};
</script>
