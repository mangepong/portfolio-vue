<template>
  <!-- <ul id="example-1"> -->
        <!-- <li v-for="(repo, index) of posts" :key="index"  class="jobs"> -->
            <v-card
                class="mx-auto my-12 card"
                max-width="1290"
                dark
            >
                <v-card-title>
                    My repos
                </v-card-title>
                <!-- {{ repo.name }} -->
                <v-row>
                    <v-col
                    v-for="repo in posts"
                    :key="repo.name"
                    >
                    <v-card
                        width="300"
                    >
                        <v-card-title v-text="repo.name"></v-card-title>

                        <v-card-text v-if="repo.description">
                            {{repo.description}}
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn icon>
                            <v-icon v-on:click="redirect(repo.html_url)">mdi-link</v-icon>
                        </v-btn>

                        <v-btn icon>
                            <v-icon v-on:click="redirect(repo.owner.html_url)">mdi-account-circle</v-icon>
                        </v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-col>
                </v-row>
            </v-card>
        <!-- </li>
      </ul> -->
</template>

<style scoped>

ul {
    text-decoration: none;
    list-style: none;
}

li {
    text-decoration: none;
}

.home {
    color: white;
}

.card {
    margin: 20px auto;
}

</style>

<script>
// @ is an alias to /src
// https://api.github.com/users/USERNAME/repos
export default {
  data() {
    return {
      posts: [],
    };
  },
  methods: {
      async getRepos() {
          const response = await this.$http.get(
          "https://api.github.com/users/mangepong/repos"
        );
        console.log(response.data);
        this.posts = response.data;
      },
      redirect(url) {
          window.location.href = url;
        //   this.$route.push(url)
      }
  },
  beforeMount(){
    this.getRepos()
 },
  
}
</script>
