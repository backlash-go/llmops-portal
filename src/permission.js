import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

function getLoginPath(path) {
  return `/login?redirect=${encodeURIComponent(path)}`
}

function hasLoginError(route) {
  const params = new URLSearchParams(window.location.search)
  return params.has('llmops_error') || Boolean(route.query && route.query.llmops_error)
}

function getLoginErrorQuery(route) {
  const params = new URLSearchParams(window.location.search)
  return {
    llmops_error: params.get('llmops_error') || route.query.llmops_error || '',
    request_id: params.get('request_id') || route.query.request_id || ''
  }
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (hasLoginError(to) && to.path !== '/login') {
    next({ path: '/login', query: getLoginErrorQuery(to), replace: true })
    return
  }

  if (whiteList.indexOf(to.path) !== -1) {
    next()
    return
  }

  const hasGetUserInfo = store.getters.name
  if (hasGetUserInfo) {
    next()
    return
  }

  try {
    await store.dispatch('user/getInfo')
    if (to.path === '/') {
      next({ path: '/usage', replace: true })
    } else {
      next()
    }
  } catch (error) {
    await store.dispatch('user/resetToken')
    next(getLoginPath(to.fullPath))
    NProgress.done()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
