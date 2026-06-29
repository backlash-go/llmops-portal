<template>
  <div class="app-container placeholder-page">
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'PlaceholderPage',
  computed: {
    title() {
      return this.$route.meta.title
    }
  }
}
</script>

<style lang="scss" scoped>
.placeholder-page {
  h1 {
    margin: 0;
    color: #0f1117;
    font-size: 32px;
    font-weight: 700;
  }
}
</style>
