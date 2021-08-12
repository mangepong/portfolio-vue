<template>
  <div class="home">
    <h3>This is a test area where I implements some functions to test the vue framework.</h3>
    <List/>
  </div>
</template>

<script>
// @ is an alias to /src
import List from '@/components/List.vue'

export default {
  name: 'Test',
  components: {
    List
  }
}
</script>