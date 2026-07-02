<template>
  <div class="login-container">
    <transition name="login-error-toast">
      <div v-if="toastError.visible" class="login-error-toast">
        <i class="el-icon-warning-outline" />
        <div>
          <strong>{{ toastError.message }}</strong>
          <span v-if="toastError.requestId">请求 ID：{{ toastError.requestId }}</span>
        </div>
      </div>
    </transition>

    <section class="login-shell">
      <div class="brand-panel">
        <div class="brand-row">
          <div class="brand-logo">
            <img
              src="https://www.luxshare-ict.com/Public/Uploads/uploadfile/images/20231018/logo2.svg"
              alt="Luxshare ICT"
            >
          </div>
          <div class="brand-text">
            <h1>AI 开放平台</h1>
          </div>
        </div>

        <div class="brand-copy">
          <h2>模型服务控制台</h2>
          <p>查看模型调用用量，管理 API Key。</p>
        </div>
      </div>

      <div class="login-panel">
        <div class="login-heading">
          <h2>欢迎登录</h2>
          <p>请用工号和密码访问 AI 开放平台。</p>
        </div>

        <el-button class="keycloak-button" :loading="loading" type="primary" @click.native.prevent="handleKeycloakLogin">
          <span class="button-icon">
            <svg-icon icon-class="link" />
          </span>
          <span>点击 SSO 登录</span>
        </el-button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      redirect: undefined,
      loginError: {
        message: '',
        requestId: ''
      },
      notifiedErrorKey: '',
      toastError: {
        visible: false,
        message: '',
        requestId: ''
      },
      toastTimer: null
    }
  },
  computed: {
    keycloakLoginUrl() {
      return process.env.VUE_APP_KEYCLOAK_LOGIN_URL || '/ops/api/v1/login/generic_oauth'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
        this.syncLoginError(route)
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.clearToastTimer()
  },
  methods: {
    syncLoginError(route) {
      const searchParams = new URLSearchParams(window.location.search)
      const message = (route.query && route.query.llmops_error) || searchParams.get('llmops_error') || ''
      const requestId = (route.query && route.query.request_id) || searchParams.get('request_id') || ''

      this.loginError = {
        message,
        requestId
      }

      const errorKey = `${message}|${requestId}`
      if (message && errorKey !== this.notifiedErrorKey) {
        this.notifiedErrorKey = errorKey
        this.showLoginErrorToast(message, requestId)
      }

      this.cleanLoginErrorQuery(route, searchParams)
    },
    cleanLoginErrorQuery(route, searchParams) {
      const routeQuery = { ...(route.query || {}) }
      let shouldReplaceRoute = false

      if (Object.prototype.hasOwnProperty.call(routeQuery, 'llmops_error')) {
        delete routeQuery.llmops_error
        shouldReplaceRoute = true
      }
      if (Object.prototype.hasOwnProperty.call(routeQuery, 'request_id')) {
        delete routeQuery.request_id
        shouldReplaceRoute = true
      }

      if (shouldReplaceRoute) {
        this.$router.replace({ path: route.path, query: routeQuery })
        return
      }

      if (searchParams.has('llmops_error') || searchParams.has('request_id')) {
        searchParams.delete('llmops_error')
        searchParams.delete('request_id')
        const query = searchParams.toString()
        const cleanUrl = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
        window.history.replaceState(null, document.title, cleanUrl)
      }
    },
    showLoginErrorToast(message, requestId) {
      this.clearToastTimer()
      this.toastError = {
        visible: true,
        message,
        requestId
      }
      this.toastTimer = window.setTimeout(() => {
        this.toastError.visible = false
      }, 3000)
    },
    clearToastTimer() {
      if (this.toastTimer) {
        window.clearTimeout(this.toastTimer)
        this.toastTimer = null
      }
    },
    handleKeycloakLogin() {
      this.loading = true
      window.location.href = this.keycloakLoginUrl
    }
  }
}
</script>

<style lang="scss">
.login-container {
  .el-button {
    border-radius: 8px;
    font-weight: 600;
  }

  .el-button--primary {
    border-color: #2f80ff;
    background: #2f80ff;

    &:hover,
    &:focus {
      border-color: #1f6fe8;
      background: #1f6fe8;
    }
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  overflow: auto;
  background:
    linear-gradient(90deg, rgba(48, 128, 255, .035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(48, 128, 255, .035) 1px, transparent 1px),
    linear-gradient(135deg, #fafdff 0%, #eef6ff 54%, #f8fbff 100%);
  background-size: 28px 28px, 28px 28px, auto;

  .login-error-toast {
    position: fixed;
    top: 78px;
    left: 50%;
    z-index: 20;
    display: flex;
    align-items: flex-start;
    width: min(700px, calc(100% - 48px));
    min-height: 64px;
    padding: 15px 18px;
    border: 1px solid #ffd1d1;
    border-radius: 8px;
    background: rgba(255, 246, 246, .96);
    box-shadow: 0 14px 30px rgba(153, 27, 27, .08);
    color: #9f1d1d;
    transform: translateX(-50%);

    i {
      flex: none;
      margin: 3px 12px 0 0;
      color: #ef6262;
      font-size: 17px;
    }

    strong {
      display: block;
      color: #9f1d1d;
      font-size: 15px;
      line-height: 1.5;
      font-weight: 700;
    }

    span {
      display: block;
      margin-top: 4px;
      color: #c05a1a;
      font-size: 13px;
      line-height: 1.5;
      font-weight: 600;
      word-break: break-all;
    }
  }

  .login-error-toast-enter-active,
  .login-error-toast-leave-active {
    transition: opacity .2s ease, transform .2s ease;
  }

  .login-error-toast-enter,
  .login-error-toast-leave-to {
    opacity: 0;
    transform: translate(-50%, -8px);
  }

  .login-shell {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) 380px;
    width: min(100%, 900px);
    overflow: hidden;
    border: 1px solid rgba(47, 128, 255, .16);
    border-radius: 12px;
    background: rgba(255, 255, 255, .92);
    box-shadow: 0 20px 52px rgba(47, 128, 255, .12);
    backdrop-filter: blur(12px);
  }

  .brand-panel {
    position: relative;
    min-height: 360px;
    padding: 42px 46px;
    background:
      linear-gradient(135deg, rgba(47, 128, 255, .12) 0%, rgba(255, 255, 255, .2) 54%, rgba(83, 145, 255, .18) 100%),
      #f4f9ff;

    &::after {
      content: '';
      position: absolute;
      right: 42px;
      bottom: 44px;
      width: 132px;
      height: 132px;
      border: 1px solid rgba(47, 128, 255, .12);
      border-radius: 28px;
      transform: rotate(7deg);
      background:
        linear-gradient(135deg, rgba(47, 128, 255, .08), rgba(255, 255, 255, .04));
    }
  }

  .brand-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    z-index: 1;
  }

  .brand-logo {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 280px;
    height: 92px;
    margin: 0 0 24px;
    padding: 0 18px;
    border: 1px solid rgba(47, 128, 255, .12);
    border-radius: 14px;
    background: rgba(238, 246, 255, .58);
    box-shadow: 0 10px 24px rgba(47, 128, 255, .08);

    img {
      display: block;
      max-width: 100%;
      max-height: 66px;
    }
  }

  .brand-text {
    h1 {
      margin: 0;
      color: #2f80ff;
      font-size: 34px;
      line-height: 1.2;
      font-weight: 800;
    }

    p {
      margin: 3px 0 0;
      color: #65758d;
      font-size: 16px;
      line-height: 1.4;
      font-weight: 700;
    }
  }

  .brand-copy {
    position: relative;
    z-index: 1;
    width: 330px;
    max-width: 100%;
    margin-top: 68px;

    h2 {
      margin: 0 0 14px;
      color: #26364d;
      font-size: 30px;
      line-height: 1.25;
      font-weight: 800;
    }

    p {
      margin: 0;
      color: #667792;
      font-size: 16px;
      line-height: 1.75;
      font-weight: 600;
    }
  }

  .login-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 42px;
    background: #fff;
  }

  .login-heading {
    margin-bottom: 24px;

    h2 {
      margin: 0 0 8px;
      color: #162033;
      font-size: 24px;
      line-height: 1.3;
      font-weight: 800;
    }

    p {
      margin: 0;
      color: #738199;
      font-size: 13px;
      line-height: 1.7;
      font-weight: 600;
    }
  }

  .keycloak-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 44px;
    border-color: #2f80ff;
    background: #2f80ff;
    box-shadow: 0 10px 20px rgba(47, 128, 255, .22);

    .button-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      margin-right: 8px;
      border-radius: 5px;
      background: rgba(255, 255, 255, .16);
    }

    .svg-icon {
      color: #fff;
      font-size: 14px;
    }

    &:hover,
    &:focus {
      border-color: #1f6fe8;
      background: #1f6fe8;
    }
  }

}

@media (max-width: 820px) {
  .login-container {
    padding: 18px;

    .login-error-toast {
      top: 22px;
      width: calc(100% - 28px);
      min-height: 60px;
      padding: 13px 14px;
    }

    .login-shell {
      grid-template-columns: 1fr;
      width: min(100%, 430px);
    }

    .brand-panel {
      min-height: auto;
      padding: 34px 28px 30px;

      &::after {
        display: none;
      }
    }

    .brand-copy {
      margin-top: 34px;

      h2 {
        font-size: 25px;
      }
    }

    .login-panel {
      padding: 30px 28px;
    }

    .brand-logo {
      width: 240px;
      max-width: 100%;
      height: 80px;
      margin: 0 0 20px;
      padding: 0 16px;

      img {
        max-height: 58px;
      }
    }

    .brand-text h1 {
      font-size: 31px;
    }
  }
}
</style>
