<template>
  <div class="list">
    <!-- <h1>{{ msg }}</h1> -->

    <form @submit.prevent="addJob(job)">
      Type in your profession here and press enter:<br>
      <input type="text" v-model="job">
    </form>

      <ul id="example-1">
        <li v-for="(job, index) of jobs" :key="job"  class="jobs">
          <a :href="'/jobs/' + job">{{ job }}</a> <v-icon class="icon" v-on:click="deleteJob(index)">mdi-close</v-icon>
        </li>
      </ul>
      The profession are clickable and removable
  </div>
</template>

<script>

// import { mdiClose } from '@mdi/js';  
export default {
  name: 'List',
  // props: {
  //   msg: String
  // },
  data: function () {
    return {
      jobs: []
    }
  },
  methods: {
    addJob: function (job) {
      this.jobs.push(job);
      this.job = "";
    },
    deleteJob: function (index) {
      this.jobs.splice(index, 1);
    }
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.icon {
  margin: 0 auto;
  float: right;
  /* top: 50%; */
  -ms-transform: translateY(50%);
  transform: translateY(50%);
}

a {
  text-decoration: none;
  color: white;
  width: 100%;
}

a :visited :active :link {
  text-decoration: none;
  color: white;
}

.jobs {
  width: 100%;
  font-size: 2em;
  background-color: rgb(73, 73, 73);
  border: solid 2px black;
  box-shadow: rgba(0,0,0,0.5) 5px 5px;
  color: white;
}

input {
  width: 100%;
  height: 50px;
  font-size: 2em;
  background-color: white;
}

.list {
  width: 50%;
  margin: 50px auto;
}

h3 {
  margin: 40px 0 0;
}
ul {
  width: 100%;
  list-style-type: none;
  padding: 0;
  float: left;
}
li {
  /* width: 100%; */
  display: block;
  /* margin: 0 10px; */
  text-align: left;
}

</style>
