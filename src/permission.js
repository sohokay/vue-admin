import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login'] // 不需要重定向 白名单

router.beforeEach(async(to, from, next) => {
  // s进度条开始
  NProgress.start()

  // 设置页面tittle
  document.title = getPageTitle(to.meta.title)

  // 判断用户是否已经登录
  const hasToken = getToken()

  if (hasToken) {
    // 是否在登录页面
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      // 进度条结束
      NProgress.done()
    } else {
      // 获取用户信息
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // 顺利的话,下一步
        next()
      } else {
        // store拿不到用户信息的话 就去请求
        try {
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // 请求失败或者设置失败,清除token,并且踢出用户
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          // 重定向
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 检查白名单
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
