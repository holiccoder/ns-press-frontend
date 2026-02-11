export const dashboardNavItems = [
  {
    key: 'Quick Submission',
    label: { en: 'Quick Submission', zh: '快速投稿' },
    children: [
      { key: 'New Submission', label: { en: 'New Submission', zh: '新建投稿' } }
    ]
  },
  {
    key: 'My Submission',
    label: { en: 'My Submission', zh: '我的投稿' },
    children: [
      { key: 'New Papers', label: { en: 'New Papers', zh: '新论文' } },
      { key: 'Under Review', label: { en: 'Under Review', zh: '审稿中' } },
      { key: 'Need to Revise', label: { en: 'Need to Revise', zh: '需修改' } },
      { key: 'Accepted', label: { en: 'Accepted', zh: '已录用' } },
      { key: 'Published', label: { en: 'Published', zh: '已发表' } },
      { key: 'Rejected', label: { en: 'Rejected', zh: '已拒稿' } },
      { key: 'Withdrawal', label: { en: 'Withdrawal', zh: '退稿' } }
    ]
  },
  {
    key: 'My Review',
    label: { en: 'My Review', zh: '我的审稿' },
    children: [
      { key: 'Pending Review', label: { en: 'Pending Review', zh: '待审稿' } },
      { key: 'Reviewed Papers', label: { en: 'Reviewed Papers', zh: '已审稿' } }
    ]
  },
  {
    key: 'My Editor-in-chief',
    label: { en: 'My Editor-in-chief', zh: '我的主编' },
    children: [
      { key: 'Journal Management', label: { en: 'Journal Management', zh: '期刊管理' } },
      { key: 'Manuscript Management', label: { en: 'Manuscript Management', zh: '稿件管理' } },
      { key: 'Application Management', label: { en: 'Application Management', zh: '申请管理' } }
    ]
  },
  {
    key: 'Join Us',
    label: { en: 'Join Us', zh: '加入我们' },
    children: [
      { key: 'All My Applications', label: { en: 'All My Applications', zh: '我的所有申请' } },
      { key: 'Join Review Team', label: { en: 'Join Review Team', zh: '加入审稿团队' } },
      { key: 'Join Editorial Board', label: { en: 'Join Editorial Board', zh: '加入编委会' } },
      { key: 'Join Editor-in-chief Group', label: { en: 'Join Editor-in-chief Group', zh: '加入主编团队' } },
      { key: 'Recommend to Peer', label: { en: 'Recommend to Peer', zh: '推荐给同行' } },
      { key: 'Recommend to Library', label: { en: 'Recommend to Library', zh: '推荐给图书馆' } }
    ]
  },
  {
    key: 'My Profile',
    label: { en: 'My Profile', zh: '我的资料' },
    children: [
      { key: 'Account Info', label: { en: 'Account Info', zh: '账户信息' } },
      { key: 'Logout', label: { en: 'Logout', zh: '退出登录' } }
    ]
  },
  {
    key: 'My System',
    label: { en: 'My System', zh: '我的系统' },
    children: [
      { key: 'home', label: { en: 'home', zh: '首页' } },
      { key: 'Logout', label: { en: 'Logout', zh: '退出登录' } }
    ]
  }
]
