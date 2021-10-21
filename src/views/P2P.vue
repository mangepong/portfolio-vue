<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 my-3" v-if="popUp">
        <h2>Create Room/Join Room</h2>
        <!-- <input v-model="roomId" /> -->
      </div>
    </div>
    <div>
      <v-form @submit.prevent="togglePopUp">
        <v-text-field
          v-model="roomId"
          label="Type an existing room id or create one"
          hide-details="auto"
          ref="popUp"
          v-if="popUp"
        ></v-text-field>
      </v-form>
    </div>
    <div class="row" v-if="!popUp">
      <div class="col-md-12">
        <div class="box">
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
            <div class="controls">
              <!-- <button type="button" class="btn btn-primary" @click="onJoin">
              Join
            </button> -->
              <button type="button" class="btn btn-primary" @click="onLeave">
                Leave
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
              <button type="button" class="btn btn-primary" @click="test">
                Test
              </button>
              <v-container class="px-0" fluid>
                <v-switch v-model="muted" :label="`Mic: ${mic()}`"></v-switch>
              </v-container>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import p2p from "@/components/Peer2Peer.vue";
export default {
  name: "P2P",
  components: { p2p },
  data() {
    return {
      img: null,
      roomId: "public-room-v2",
      muted: false,
      activeCamera: true,
      popUp: true,
    };
  },
  methods: {
    togglePopUp() {
      this.popUp = !this.popUp;
      setTimeout(() => {
        this.$refs.p2p.join();
      }, 100);
    },
    test() {
      this.$refs.p2p.test();
    },
    toggleCamera() {
      let camera = document.getElementsByClassName("camera-item");
      console.log(camera);
      if (camera.length > 0 && this.activeCamera) {
        console.log("PÅ");
        this.$refs.p2p.stopCamera();
        this.activeCamera = !this.activeCamera;
      } else {
        console.log("AV");
        this.$refs.p2p.startCamera();
        this.activeCamera = !this.activeCamera;
      }
    },
    mic() {
      return this.muted ? "Off" : "On";
    },
    onCapture() {
      this.img = this.$refs.p2p.capture();
    },
    onJoin() {
      this.$refs.p2p.join();
    },
    onLeave() {
      this.$refs.p2p.leave();
      this.$router.push('/')
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
<style>

body {
  overflow-y: hidden;
}

.box > div{
  display: inline-block;
  /* vertical-align: middle; */
}

.controls {
  margin-left: 5%;
  /* display: inline-block; */
}
</style>