/* Layout */
import Layout from '@/layout'

/**
 * 学校管理
 */
const Family_SchoolInteractionRouter = {
  path: '/family-schoolInteraction',
  component: Layout,
  redirect: '/family-schoolInteraction/schoolNotice/myRecord',
  name: 'Family-SchoolInteraction',
  meta: { title: '家校互动', icon: 'el-icon-s-help' },
  alwaysShow: true,
  children: [
    {
      path: 'schoolNotice',
      name: 'SchoolNotice',
      component: () => import('@/views/Family-SchoolInteraction/index'),
      meta: { title: '校园通知', icon: 'table' },
      redirect: '/family-schoolInteraction/schoolNotice/myRecord',
      children: [
        {
          path: 'myRecord',
          name: 'MyRecord',
          component: () => import('@/views/Family-SchoolInteraction/MyRecord'),
          meta: { title: '我的发布', icon: 'table' }
        },
        {
          path: 'list',
          name: 'SchoolNoticeList',
          component: () => import('@/views/Family-SchoolInteraction/SchoolNoticeList'),
          meta: { title: '通知列表', icon: 'table' }
        },
        {
          path: 'edit',
          name: 'EditSchoolNoticeList',
          component: () => import('@/views/Family-SchoolInteraction/EditSchoolNotice'),
          meta: { title: '发布通知', icon: 'table' },
          children: [
            {
              path: ':id',
              name: 'UpdateSchoolNoticeList',
              hidden: true,
              component: () => import('@/views/Family-SchoolInteraction/EditSchoolNotice'),
              meta: { title: '修改通知', icon: 'table', activeMenu: '/family-schoolInteraction/schoolNotice/edit' }
            }
          ]
          // component: () => import('@/views/Family-SchoolInteraction/EditSchoolNotice'),
          // meta: { title: '发布通知', icon: 'table' }
        }
      ]
    }
  ]
}
export default Family_SchoolInteractionRouter
