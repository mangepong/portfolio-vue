<template>
  <div class="home">
    <h1>This is an about page</h1>

    <button v-on:click="createStream()">CreateStream</button>
    <div></div>
    <button v-on:click="recordStream()">Record</button>
    <div></div>
    <button v-on:click="stopRecord()">Stop</button>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      stream: "",
      source: {},
      recorder: {},
    };
  },
  computed: {},
  methods: {
    async createStream() {
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true
      });
    },
    recordStream() {
      this.recorder = new MediaRecorder(this.stream);
      const chunks = [];
      this.recorder.ondataavailable = (e) => {
        chunks.push(e.data)
      };
      this.recorder.start();
      this.recorder.onstop = (e) => {
        const completeBlob = new Blob(chunks, { type: "video/webm" });
        console.log(e);
        this.source = URL.createObjectURL(completeBlob);
        console.log(this.source);
      };
    },
    stopRecord() {
      this.recorder.stop();
      console.log(this.source);
    },
  },
  mounted() {},
};
</script>
