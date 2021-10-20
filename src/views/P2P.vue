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
            :muted="muted"
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
            <button
              type="button"
              class="btn btn-primary"
              @click="toggleCamera"
            >
              Camera
            </button>
            <v-container class="px-0" fluid>
              <v-switch
                v-model="muted"
                :label="`Mic: ${mic()}`"
              ></v-switch>
            </v-container>
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
      muted: false,
      activeCamera: true,
    };
  },
  methods: {
    toggleCamera() {
      let camera = document.getElementsByClassName("camera-item");
      console.log(camera)
      if (camera.length > 0 && this.activeCamera) {
        console.log("PÅ")
        this.$refs.p2p.stopCamera()
        this.activeCamera = !this.activeCamera
      } else {
        console.log("AV")
        this.$refs.p2p.startCamera()
        this.activeCamera = !this.activeCamera
      }
    },
    mic() {
      return this.muted ? "Off" : "On"
    },
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
