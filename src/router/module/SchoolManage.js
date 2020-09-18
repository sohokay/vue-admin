/* Layout */
import Layout from '@/layout'

/**
 * 学校管理
 */
const SchoolManageRouter = {
  path: '/schoolManage',
  component: Layout,
  redirect: '/schoolManage/classManage',
  name: 'SchoolManage',
  meta: { title: '学校管理', icon: 'el-icon-s-help' },
  alwaysShow: true,
  children: [
    {
      path: 'class',
      name: 'ClassManage',
      component: () => import('@/views/SchoolManage/ClassManage'),
      meta: { title: '班级管理', icon: 'table' }
    },
    {
      path: 'student',
      component: () => import('@/views/SchoolManage/index'),
      name: 'Student',
      redirect: '/schoolManage/student/classManagement',
      meta: { title: '学生管理', icon: 'table' },
      children: [
        {
          path: 'class',
          name: 'StudentClassManage',
          component: () => import('@/views/SchoolManage/ClassManage'),
          meta: { title: '班级管理', icon: 'table' }
        },
        {
          path: 'student',
          name: 'StudentManage',
          component: () => import('@/views/SchoolManage/StudentManage'),
          meta: { title: '学生管理', icon: 'table' }
        }
      ]
    },
    {
      path: '/business',
      component: () => import('@/views/SchoolManage/BusinessOrder'),
      name: 'BusinessOrder',
      meta: { title: '业务订购', icon: 'el-icon-s-help' }
    }
  ]
}
export default SchoolManageRouter
