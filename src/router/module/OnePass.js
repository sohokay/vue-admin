/* Layout */
import Layout from '@/layout'

/**
 * 一卡通
 */

const OnePassRouter = {
  path: '/OnePass',
  component: Layout,
  redirect: '/OnePass/schoolAttendance',
  name: 'OnePass',
  meta: { title: '一卡通管理', icon: 'el-icon-s-help' },
  alwaysShow: true,
  children: [
    {
      path: 'schoolAttendance',
      name: 'SchoolAttendance',
      component: () => import('@/views/OnePass/SchoolAttendance'),
      meta: { title: '校园考勤', icon: 'table' }
    },
    {
      path: 'schoolBusAttendance',
      name: 'SchoolBusAttendance',
      component: () => import('@/views/OnePass/SchoolBusAttendance'),
      meta: { title: '校车考勤', icon: 'table' }
    },
    {
      path: 'familyPhone',
      name: 'FamilyPhone',
      component: () => import('@/views/OnePass/FamilyPhone.vue'),
      meta: { title: '亲情号码', icon: 'table' }
    },
    {
      path: 'schoolCardManage',
      name: 'SchoolCardManage',
      component: () => import('@/views/OnePass/SchoolCardManage.vue'),
      meta: { title: '校卡管理', icon: 'table' }
    }
  ]
}
export default OnePassRouter
