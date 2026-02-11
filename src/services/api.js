import axios from 'axios'

// API基础配置
const API_BASE_URL = 'http://localhost:8000/api' // 替换为实际的API地址



// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const language = getLanguage()
    const token = getToken()
    
    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 将语言参数添加到请求参数中
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        lang: language === 'zh' ? '中文' : 'English'
      }
    } else {
      // 对于POST等请求，添加到请求体中
      if (!config.data) {
        config.data = {}
      }
      const langValue = language === 'zh' ? '中文' : 'English'
      if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
        config.data.append('lang', langValue)
      } else {
        config.data.lang = langValue
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API request failed:', error)
    return Promise.reject(error)
  }
)

// 获取存储的语言设置
export const getLanguage = () => {
  return localStorage.getItem('language') || 'zh'
}

// 设置语言并刷新页面
export const setLanguage = (language) => {
  localStorage.setItem('language', language)
  // 刷新当前页面，保持当前路径
  window.location.reload()
}

// Token管理
export const getToken = () => {
  return localStorage.getItem('authToken')
}

export const setToken = (token) => {
  localStorage.setItem('authToken', token)
}

export const removeToken = () => {
  localStorage.removeItem('authToken')
}


// 登录注册相关接口
export const authAPI = {
  login: (payload) => apiClient.post('/login/account', payload),
  register: (payload) => apiClient.post('/login/register', payload),
  logout: () => {
    removeToken()
    return Promise.resolve()
  }
}

// User profile related APIs
export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (payload) => apiClient.post('/user/profile', payload)
}


// 首页相关接口
export const homeAPI = {
  // 获取首页数据
  getHomeData: () => apiClient.get('/home'),
  
  // 获取期刊列表
  getJournals: () => apiClient.get('/journals'),
  
  // 获取图书列表
  getBooks: () => apiClient.get('/books'),
  
  // 获取关于我们信息
  getAboutInfo: () => apiClient.get('/about')
}

// 期刊相关接口
export const journalAPI = {
  // 获取期刊列表（分页）
  getJournalList: (page = 1, pageSize = 12) => 
    apiClient.get(`/index/journalList?page=${page}&pageSize=${pageSize}`),
  
  // 获取期刊详情
  getJournalDetail: (id) => apiClient.get(`/index/journalDetail?id=${id}`),
  
  // 获取期刊的数字期刊列表
  getDigitalJournals: (journalId, year, issue, pageNo = 1, pageSize = 10) => {
    const params = {
      journal_id: journalId,
      page_no: pageNo,
      page_size: pageSize 
    }
    if (year) params.year = year
    if (issue) params.periods = issue
    return apiClient.get(`/index/journalContents`, { params })
  },
  
  // 获取数字期刊文章详情
  getDigitalJournalArticle: (articleId) => 
    apiClient.get(`/index/journalContentDetail?id=${articleId}`)
}

// 图书相关接口
export const bookAPI = {
  // 获取图书列表（分页）
  getBookList: (page = 1, pageSize = 6) => 
    apiClient.get(`/index/bookList?page=${page}&pageSize=${pageSize}`),
  
  // 获取图书详情
  getBookDetail: (id) => apiClient.get(`/index/bookDetail?id=${id}`)
}

// 投稿相关接口
export const submissionAPI = {
  // 获取投稿指南
  getSubmissionGuidelines: () => apiClient.get('/submission/guidelines'),
  
  // 获取期刊选项
  getJournalOptions: () => apiClient.get('/submission/journals'),

  // 验证码
  captcha: () => apiClient.get('/index/captcha'),
  
  // 提交投稿
  submitArticle: (formData) => {
    const token = getToken()
    return apiClient.post('/index/contribute', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { token }:{})
      }
    })
  },
  
  // 上传文件
  // uploadFile: (formData) => apiClient.post('/upload/file', formData),
  uploadFile: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// 信息指南相关接口
export const guideAPI = {
  // 获取作者指南
  getAuthorGuide: () => apiClient.get('/index/policyInfo'),
  
  // 获取审稿人指南
  getReviewerGuide: () => apiClient.get('/guide/reviewer'),
  
  // 获取开放获取信息
  getOpenAccessInfo: () => apiClient.get('/guide/open-access')
}

// 文章处理费相关接口
export const apcAPI = {
  // 获取文章处理费信息
  getAPCInfo: () => apiClient.get('/apc'),
  
  // 获取费用标准
  getFeeStandards: () => apiClient.get('/apc/standards'),
  
  // 获取减免政策
  getWaiverPolicy: () => apiClient.get('/apc/waiver')
}

// 通用接口
export const commonAPI = {
  // 获取网站配置
  getSiteConfig: () => apiClient.get('/config'),
  
  // 获取联系信息
  getContactInfo: () => apiClient.get('/contact'),
  
  // 获取友情链接
  getFriendlyLinks: () => apiClient.get('/links')
}

export default {
  authAPI,
  userAPI,
  homeAPI,
  journalAPI,
  bookAPI,
  submissionAPI,
  guideAPI,
  apcAPI,
  commonAPI,
  getLanguage,
  setLanguage
}
