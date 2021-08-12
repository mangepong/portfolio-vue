<template>
  <div class="home">
    Your profession is {{ $route.params.job }}
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Jobs',
  data: function () {
    return {
      
    }
  },
}
</script>