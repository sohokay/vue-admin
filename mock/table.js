const Mock = require('mockjs')

/**
 * 默认table数据
 */
const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})
/**
 * 学生考勤数据
 */
const SchoolAttendanceDara = Mock.mock({
  'items|30': [{
    id: '@id',
    avatar: '@Image("125x125")',
    guid: '@guid',
    name: '@cname',
    studentNumber: '@integer(1000000,9999999)',
    'sex|1': [1, 2, 3],
    'type|1': ['走读生', '住校生'],
    'className|1': ['一年级一班', '一年级二班', '二年级三班'],
    deviceCode: '@integer(100000000,999999999)',
    cardNumber: '@integer(100000000,999999999)',
    'inOrOut|1': [1, 2],
    clockIn: '@datetime',
    'status|1': [1, 2, 3],
    deviceLocation: '@ctitle(2, 10)',
    relation: [{
      id: 1,
      call: '爸爸',
      phone: '13800138000'
    },
    {
      id: 2,
      call: '妈妈',
      phone: '13800138999'
    }]
    // display_time: '@datetime',
    // pageviews: '@integer(300, 5000)'
  }]
})

module.exports = [
  /**
   * 默认table数据
   */
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        'code': 20000,
        'data': {
          'total': items.length,
          'items': items
        }
      }
    }
  },
  /**
   * 学生考勤数据
   */
  {
    url: '/vue-admin-template/table/schoolAttendance',
    type: 'get',
    response: config => {
      const items = SchoolAttendanceDara.items
      return {
        code: 20000,
        data: {
          'total': items.length,
          'items': items
        }
      }
    }
  }
]
