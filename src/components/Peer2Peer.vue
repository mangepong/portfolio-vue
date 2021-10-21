<template>
  <div>
    <div class="row">
      <div class="col-md-12 my-3">
        <h2>Room ID: {{ roomId }}</h2>
      </div>
    </div>
    <div class="camera-list">
      <div
        v-for="item in cameraList"
        v-bind:video="item"
        v-bind:key="item.id"
        class="camera-item"
      >
        <video
          autoplay
          playsinline
          ref="cameras"
          :height="cameraHeight"
          :muted="muted"
          :id="item.id"
        ></video>
      </div>
    </div>
    <div class="video-list">
      <div
        v-for="item in videoList"
        v-bind:video="item"
        v-bind:key="item.id"
        class="video-item"
      >
        <video
          controls
          autoplay
          playsinline
          ref="videos"
          :height="600"
          :muted="item.muted"
          :id="item.id"
        ></video>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import SimpleSignalClient from "simple-signal-client";

export default {
  name: "p2p",
  components: {},
  data() {
    return {
      signalClient: null,
      videoList: [],
      canvas: null,
      socket: null,
      cameraList: [],
      cameraID: null,
      screensIDs: [],
    };
  },
  props: {
    roomId: {
      type: String,
      default: "public-room-v2",
    },
    socketURL: {
      type: String,
      // default: "https://weston-vue-webrtc-lobby.azurewebsites.net",
      // default: "http://localhost:1337",
      default: 'http://vue-streaming-server.herokuapp.com'
    },
    cameraHeight: {
      type: [Number, String],
      default: 160,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    screenshotFormat: {
      type: String,
      default: "image/jpeg",
    },
    enableAudio: {
      type: Boolean,
      default: true,
    },
    enableVideo: {
      type: Boolean,
      default: true,
    },
    enableLogs: {
      type: Boolean,
      default: true,
    },
    peerOptions: {
      type: Object, // NOTE: use these options: https://github.com/feross/simple-peer
      default() {
        return {};
      },
    },
    deviceId: {
      type: String,
      default: null,
    },
    muted: {
      type: Boolean,
      default: false,
    },
  },
  watch: {},
  mounted() {},
  methods: {
    async join() {
      var that = this;
      this.log("join");
      this.socket = io(this.socketURL, {
        rejectUnauthorized: false,
        transports: ["websocket"],
      });
      this.signalClient = new SimpleSignalClient(this.socket);
      let constraints = {
        video: that.enableVideo,
        audio: that.enableAudio,
      };
      if (that.deviceId && that.enableVideo) {
        constraints.video = { deviceId: { exact: that.deviceId } };
      }
      const localStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      this.log("opened", localStream);
      this.joinedRoom(localStream, true);
      this.signalClient.once("discover", (discoveryData) => {
        that.log("discovered", discoveryData);
        async function connectToPeer(peerID) {
          if (peerID == that.socket.id) return;
          try {
            that.log("Connecting to peer");
            const { peer } = await that.signalClient.connect(
              peerID,
              that.roomId,
              that.peerOptions
            );
            that.cameraList.forEach((v) => {
              if (v.isLocal) {
                that.onPeer(peer, v.stream);
              }
            });
          } catch (e) {
            that.log("Error connecting to peer");
          }
        }
        discoveryData.peers.forEach((peerID) => connectToPeer(peerID));
        that.$emit("opened-room", that.roomId);
      });
      this.signalClient.on("request", async (request) => {
        that.log("requested", request);
        const { peer } = await request.accept({}, that.peerOptions);
        that.log("accepted", peer);
        if (that.cameraList.length > 0) {
          that.cameraList.forEach((v) => {
            if (v.isLocal) {
              that.onPeer(peer, v.stream);
            }
          });
        }
      });
      this.signalClient.discover(that.roomId);
    },
    onPeer(peer, localStream) {
      var that = this;
      that.log("onPeer");
      peer.addStream(localStream);
      peer.on("stream", async (remoteStream) => {
        try {
          const response = await this.$http.get(this.socketURL + "/getscreen");
          console.log(response.data);
          if (response.data.includes(remoteStream.id)) {
            console.log("SCREEEEEEEEEEEEEEEEEN")
            this.onPeerScreen(peer, remoteStream);
          } else {
            that.joinedRoom(remoteStream, false);
            peer.on("close", () => {
              var newList = [];
              that.cameraList.forEach(function(item) {
                if (item.id !== remoteStream.id) {
                  newList.push(item);
                }
              });
              that.cameraList = newList;
              that.$emit("left-room", remoteStream.id);
            });
            peer.on("error", (err) => {
              that.log("peer error ", err);
            });
          }
        } catch (error) {
          console.log(error);
        }
      });
    },
    onPeerScreen(peer, remoteStream) {
      var that = this;

      that.joinedRoomScreen(remoteStream, false);
      peer.on("close", () => {
        console.log("CLOSE")
        var newList = [];
        that.videoList.forEach(function(item) {
          if (item.id !== remoteStream.id) {
            newList.push(item);
          }
        });
        that.videoList = newList;
        that.$emit("left-room", remoteStream.id);
      });
      peer.on("error", (err) => {
        that.log("peer error ", err);
      });
    },
    joinedRoomScreen(stream, isLocal) {
      var that = this;
      let found = that.videoList.find((video) => {
        return video.id === stream.id;
      });
      if (found === undefined) {
        let video = {
          id: stream.id,
          muted: this.muted,
          stream: stream,
          isLocal: isLocal,
        };
        that.videoList.push(video);
      }
      setTimeout(function() {
        for (var i = 0, len = that.$refs.videos.length; i < len; i++) {
          if (that.$refs.videos[i].id === stream.id) {
            that.$refs.videos[i].srcObject = stream;
            break;
          }
        }
      }, 500);
      that.$emit("joined-room", stream.id);
    },
    joinedRoom(stream, isLocal) {
      var that = this;
      let found = that.cameraList.find((video) => {
        return video.id === stream.id;
      });
      if (found === undefined) {
        let video = {
          id: stream.id,
          muted: this.muted,
          stream: stream,
          isLocal: isLocal,
        };
        this.cameraID = stream.id;
        that.cameraList.push(video);
        this.activeCamera = true;
      }
      setTimeout(function() {
        for (var i = 0, len = that.$refs.cameras.length; i < len; i++) {
          if (that.$refs.cameras[i].id === stream.id) {
            that.$refs.cameras[i].srcObject = stream;
            break;
          }
        }
      }, 500);
      that.$emit("joined-room", stream.id);
    },
    stopCamera() {
      let x = 0;
      this.cameraList.forEach((v) => {
        if (v.isLocal) {
          v.stream.getTracks().forEach((t) => t.stop());
          console.log("index", x);
          console.log(this.cameraID);
          this.cameraList.splice(x, 1);
        }
        x += 1;
      });
    },
    async startCamera() {
      let constraints = {
        video: this.enableVideo,
        audio: this.enableAudio,
      };
      if (this.deviceId && this.enableVideo) {
        constraints.video = { deviceId: { exact: this.deviceId } };
      }

      const localStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      this.log("opened", localStream);
      this.joinedRoom(localStream, true);
    },
    leave() {
      this.videoList.forEach((v) =>
        v.stream.getTracks().forEach((t) => t.stop())
      );
      this.cameraList.forEach((v) =>
        v.stream.getTracks().forEach((t) => t.stop())
      );
      this.videoList = [];
      this.cameraList = [];
      this.signalClient.peers().forEach((peer) => peer.removeAllListeners());
      this.signalClient.destroy();
      this.signalClient = null;
      this.socket.destroy();
      this.socket = null;
    },
    capture() {
      return this.getCanvas().toDataURL(this.screenshotFormat);
    },
    getCanvas() {
      let video = this.$refs.videos[0];
      if (video !== null && !this.ctx) {
        let canvas = document.createElement("canvas");
        canvas.height = video.clientHeight;
        canvas.width = video.clientWidth;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
      }
      const { ctx, canvas } = this;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas;
    },
    async shareScreen() {
      console.log("asdasdasdasd");
      var that = this;
      if (navigator.mediaDevices == undefined) {
        that.log("Error: https is required to load cameras");
        return;
      }
      try {
        var screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        this.screensIDs.push(screenStream.id);
        this.joinedRoomScreen(screenStream, true);
        that.$emit("share-started", screenStream.id);
        that.signalClient.peers().forEach((p) => that.onPeer(p, screenStream));
        console.log("skickar", screenStream.id);
        await this.$http.post(this.socketURL + "/setscreen", {
          id: screenStream.id,
        });
      } catch (e) {
        that.log("Media error: " + JSON.stringify(e));
      }
    },
    log(message, data) {
      if (this.enableLogs) {
        console.log(message);
        if (data != null) {
          console.log(data);
        }
      }
    },
  },
};
</script>
<style>
.video-list {
  background: whitesmoke;
  height: auto;
  display: flex;
  width: 70%;
  flex-direction: row;
  /* justify-content: center; */
  flex-wrap: wrap;
}
.video-list div {
  padding: 0px;
}
.video-item {
  background: #c5c4c4;
  display: inline-block;
}

.camera-list {
  height: auto;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}
.camera-list div {
  padding: 0px;
}
.camera-item {
  background: #c5c4c4;
  display: inline-block;
}
</style>
