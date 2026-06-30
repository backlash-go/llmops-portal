<template>
  <div class="login-container">
    <section class="login-panel">
      <div class="panel-accent" />
      <div class="brand">
        <div class="brand-mark">
          <span>L</span>
        </div>
        <div class="brand-text">
          <h1>LuxAI 开放平台</h1>
        </div>
      </div>

      <div class="login-copy">
        <p>登录后可查看模型调用用量、管理 API Key。</p>
      </div>

      <div v-if="loginError.message" class="login-error">
        <i class="el-icon-warning-outline" />
        <div>
          <strong>{{ loginError.message }}</strong>
          <span v-if="loginError.requestId">请求 ID：{{ loginError.requestId }}</span>
        </div>
      </div>

      <el-button class="keycloak-button" :loading="loading" type="primary" @click.native.prevent="handleKeycloakLogin">
        <span class="button-icon">
          <svg-icon icon-class="link" />
        </span>
        <span>点击 SSO 登录</span>
      </el-button>
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
      notifiedErrorKey: ''
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
        const requestText = requestId ? `，请求 ID：${requestId}` : ''
        this.$message.error(`${message}${requestText}`)
      }

      if (searchParams.has('llmops_error')) {
        const cleanUrl = `${window.location.origin}${window.location.pathname}${window.location.hash}`
        window.history.replaceState(null, document.title, cleanUrl)
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
    border-radius: 6px;
    font-weight: 600;
  }

  .el-button--primary {
    border-color: #316dca;
    background: #316dca;

    &:hover,
    &:focus {
      border-color: #275fb6;
      background: #275fb6;
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
  padding: 32px 20px;
  overflow: auto;
  background:
    linear-gradient(90deg, rgba(49, 109, 202, .05) 1px, transparent 1px),
    linear-gradient(180deg, rgba(49, 109, 202, .05) 1px, transparent 1px),
    radial-gradient(circle at 26% 18%, rgba(49, 109, 202, .16), transparent 32%),
    radial-gradient(circle at 78% 78%, rgba(47, 158, 143, .12), transparent 30%),
    linear-gradient(135deg, #eef5ff 0%, #f8fbff 46%, #f5f7fb 100%);
  background-size: 28px 28px, 28px 28px, auto, auto, auto;

  .login-panel {
    position: relative;
    width: 504px;
    max-width: 100%;
    padding: 58px 58px 46px;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, .28);
    border-radius: 8px;
    background: rgba(255, 255, 255, .96);
    box-shadow: 0 22px 60px rgba(31, 41, 55, .13);
    backdrop-filter: blur(16px);
  }

  .panel-accent {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #316dca 0%, #2f9e8f 100%);
  }

  .brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 34px;
    text-align: center;
  }

  .brand-mark {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    border-radius: 16px;
    color: #fff;
    font-size: 36px;
    font-weight: 700;
    background: linear-gradient(145deg, #316dca 0%, #2f9e8f 100%);
    box-shadow: 0 14px 32px rgba(37, 99, 235, .24);

    &::after {
      content: '';
      position: absolute;
      right: -8px;
      bottom: 11px;
      width: 20px;
      height: 20px;
      border: 4px solid #fff;
      border-radius: 50%;
      background: #f97316;
    }
  }

  .brand-text {
    h1 {
      margin: 0 0 8px;
      color: #111827;
      font-size: 30px;
      line-height: 1.2;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: #6b7280;
      font-size: 15px;
    }
  }

  .login-copy {
    margin-bottom: 22px;
    padding: 21px 24px 20px;
    border: 1px solid #e5edf8;
    border-radius: 8px;
    background: linear-gradient(180deg, #f8fbff 0%, #f5f8fc 100%);
    text-align: center;

    h2 {
      margin: 0 0 8px;
      color: #1f2937;
      font-size: 18px;
      line-height: 1.4;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: #64748b;
      font-size: 15px;
      line-height: 1.65;
    }
  }

  .login-error {
    display: flex;
    align-items: flex-start;
    margin-bottom: 18px;
    padding: 12px 14px;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #991b1b;
    background: #fff1f2;
    text-align: left;

    i {
      margin: 2px 8px 0 0;
      font-size: 17px;
    }

    strong {
      display: block;
      font-size: 14px;
      line-height: 1.5;
      font-weight: 600;
    }

    span {
      display: block;
      margin-top: 3px;
      color: #b45309;
      font-size: 12px;
      line-height: 1.5;
      word-break: break-all;
    }
  }

  .keycloak-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    border-color: #316dca;
    background: #316dca;
    box-shadow: 0 12px 24px rgba(49, 109, 202, .22);

    .button-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-right: 10px;
      border-radius: 5px;
      background: rgba(255, 255, 255, .16);
    }

    .svg-icon {
      color: #fff;
      font-size: 14px;
    }

    &:hover,
    &:focus {
      border-color: #275fb6;
      background: #275fb6;
      box-shadow: 0 14px 28px rgba(49, 109, 202, .26);
    }
  }

}

@media (max-width: 560px) {
  .login-container {
    padding: 18px;

    .login-panel {
      padding: 42px 26px 34px;
    }

    .brand-mark {
      width: 72px;
      height: 72px;
      font-size: 33px;
    }

    .brand-text h1 {
      font-size: 25px;
    }
  }
}
</style>
