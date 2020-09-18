import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
export function getSchoolAttendanceList(params) {
  return request({
    url: '/table/schoolAttendance',
    method: 'get',
    params
  })
}
