<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <span class="brand-collapsed">L</span>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <span class="brand-row">
          <span class="brand-word">luxai</span>
          <span class="brand-badge">开放平台</span>
        </span>
        <span class="brand-divider" />
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'LuxAI 开放平台'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 120px;
  padding: 0;
  background: #f7f8fa;
  overflow: hidden;

  & .sidebar-logo-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
    height: 100%;
    width: 100%;
    min-width: 0;
  }

  .brand-row {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 88px;
    width: 100%;
    min-width: 0;
    padding: 18px 18px 14px;
  }

  .brand-word {
    flex: 0 0 auto;
    color: #030712;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 38px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  .brand-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    height: 30px;
    min-width: 68px;
    margin-left: 10px;
    padding: 0 10px;
    border-radius: 8px;
    background: #000;
    color: #fff;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
  }

  .brand-divider {
    display: block;
    align-self: stretch;
    flex: 0 0 1px;
    height: 1px;
    margin: 0 22px;
    background: #d9dde5;
  }

  .brand-collapsed {
    color: #030712;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 28px;
    font-weight: 800;
    line-height: 1;
  }

  &.collapse {
    height: 64px;
    padding: 0;

    .sidebar-logo-link {
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
