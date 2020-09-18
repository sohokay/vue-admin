import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  //  根据权限动态生成路由
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },

  // schoolAttendance: [
  //   {
  //   'id': 1,
  //   'title': '学校考勤',
  //   'permission': {
  //     'add': {}, 'export':{}
  //   },
  //   'status': true,
  //   children: [{
  //     'id': 3,
  //     'title': '学校考勤XXX',
  //     'permission': ['add', 'xxx'],
  //     'status': true,
  //     children: []
  //   }]
  // },
  //   {
  //     'id': 2,
  //     'title': '学生考勤',
  //     'permission': ['visit', 'edit'],
  //     'status': true,
  //     children: []
  //   }
  //   ]

  // 1. 设定权限
  getPermissions({ rootState, commit }) {
    return new Promise(resolve => {
      const permission = {
        onePass: {
          'id': 1,
          'title': '一卡通',
          'name': ' onePass',
          'status': true,
          children: [
            {
              'id': 3,
              'name': 'schoolAttendance',
              'title': '学校考勤',
              'status': true,
              'permission': [
                {
                  'id': 1,
                  'title': '新增',
                  'name': 'add',
                  'status': true
                }, {
                  'id': 2,
                  'title': '导出',
                  'name': 'export',
                  'status': true
                }
              ],
              children: []
            },
            {
              'id': 2,
              'name': 'schoolBusAttendance',
              'title': '校车考勤',
              'status': true,
              'permission': {
                'add': {
                  'title': '新增',
                  'status': true
                },
                'export': {
                  'title': '导出',
                  'status': true
                }
              },
              children: []
            }
          ]
        }
      }

      // 模拟权限数据
      let permissions
      if (rootState.token.account === 'admin') {
        permissions = [
          'permission.browse',
          'permission.create',
          'permission.edit',
          'permission.remove'
        ]
      } else if (rootState.token.account === 'test') {
        permissions = [
          'permission.browse'
        ]
      } else {
        permissions = []
      }
      commit('setPermissions', permissions)
      resolve(permissions)
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
