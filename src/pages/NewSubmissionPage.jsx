import { useState, useEffect } from 'react'
import { Select, Input, Button, Upload, message, Form } from 'antd'
import { SendOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { submissionAPI, journalAPI, guideAPI, authAPI } from '../services/api'
import { dashboardNavItems as navItems } from '../constants/dashboardNavItems'
import { dashboardPanelTranslations } from '../constants/dashboardPanelTranslations'
import './SubmissionPage.less'

const NewSubmissionPage = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [openMenus, setOpenMenus] = useState({ 'Quick Submission': true, 'My Submission': true })
  const [journals, setJournals] = useState([])
  const [paperFile, setPaperFile] = useState(null)
  const [graphicFile, setGraphicFile] = useState(null)
  const [article, setArticle] = useState(null)
  const [captchaText, setCaptchaText] = useState('')
  const [isGetCaptcha, setIsGetCaptcha] = useState(false)
  const [form] = Form.useForm()
  
  const { newSubmission } = dashboardPanelTranslations
  const t = newSubmission.form

  useEffect(() => {
    if (!isGetCaptcha) {
      setIsGetCaptcha(true)
      submissionAPI.captcha().then(res => {
        setCaptchaText(res.data.image)
      })
    }
  }, [isGetCaptcha])

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await journalAPI.getJournalList(1, 200)
        const list = res?.data?.lists
        if (res?.code !== 0 && Array.isArray(list)) {
          setJournals(list)
        }
      } catch (err) {
        // ignore
      }
    }
    fetchJournals()
  }, [])

  const toggleMenu = (key, hasChildren) => {
    if (!hasChildren) return
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleNavClick = (key) => {
    const submissionStatusMap = {
      'Under Review': 0,
      'Need to Revise': 1,
      'Accepted': 2,
      'Published': 4,
      'Rejected': 3,
      'Withdrawal': 3
    }

    if (key === 'All My Submission') {
      navigate('/dashboard/my-submission')
      return
    }

    if (Object.prototype.hasOwnProperty.call(submissionStatusMap, key)) {
      navigate(`/dashboard/my-submission?status=${submissionStatusMap[key]}`)
      return
    }

    if (key === 'Logout') {
      authAPI.logout()
      navigate('/login')
      return
    }

    if (key === 'New Submission') {
      // already on this page
      return
    }
    if (key === 'Account Info') {
      navigate('/dashboard/account-info')
      return
    }
    if (key === 'Join Editor-in-chief Group') {
      navigate('/dashboard/join-editor-in-chief')
      return
    }
  }

  const beforeUploadPrevent = (file) => {
    // Prevent auto upload; we'll attach files to FormData on submit
    return false
  }

  const handleRequestUpload = ({ file, onSuccess, onError }) => {  
     
      submissionAPI.uploadFile(file).then(res => {
        console.log(res.data.uri)
        setPaperFile(res.data.uri)
        setArticle(res.data.uri)
        onSuccess()
      }).catch(err => {
        onError(err)
      })
    }

  const generateCaptcha = () => {
    setIsGetCaptcha(false)
  }

  const onFinish = async (values) => {
    message.loading({ content: 'Submitting...', key: 'submit' })
    try {
      const formData = new FormData()

      const profile = localStorage.getItem('userProfile')
      const realName = profile ? JSON.parse(profile).real_name : ''
      const mobile = profile ? JSON.parse(profile).phone : ''
      const email = profile ? JSON.parse(profile).email : ''
      const intro = profile ? JSON.parse(profile).intro : ''
      const user_id = profile ? JSON.parse(profile).user_id : 0
      formData.append('name', realName)
      formData.append('email', email)
       formData.append('mobile', mobile)
       formData.append('Introduction', intro)
      formData.append('journal', values.journal)
      formData.append('journal_id', values.journal) 
      formData.append('paper_category', values.category)
      formData.append('paper_title', values.title)
      formData.append('author_list', values.authors)
      formData.append('abstract', values.abstract)
      formData.append('keywords', values.keywords)
      formData.append('number_of_pages', values.pages)
      formData.append('paper_fields', values.fields)
      formData.append('file', paperFile)
      formData.append('code', values.code)
      formData.append('user_id', user_id)

      const res = await submissionAPI.submitArticle(formData)

      if (res?.code === 1) {
        message.success({ content: res?.msg || 'Submission successful', key: 'submit' })
        navigate('/dashboard/my-submission')
        return
      }

      message.error({ content: res?.msg || 'Submission failed', key: 'submit' })
      generateCaptcha()
    } catch (err) {
      message.error({ content: 'Submission failed', key: 'submit' })
      generateCaptcha()
    }
  }

  return (
    <div className="dashboard-page">
      <Header />
      <section className="dashboard-section">
        <div className="dashboard-shell">
          <aside className="dashboard-sidebar">
            <nav className="sidebar-nav">
              {navItems.map((item) => {
                const hasChildren = Boolean(item.children?.length)
                const isOpen = Boolean(openMenus[item.key])
                return (
                  <div key={item.key} className={`nav-group ${hasChildren ? 'has-children' : ''} ${isOpen ? 'is-open' : ''}`}>
                    <button type="button" className="nav-item" onClick={() => toggleMenu(item.key, hasChildren)} aria-expanded={hasChildren ? isOpen : undefined}>
                      <span className="nav-icon"><PlusOutlined /></span>
                      <span className="nav-label">{item.label[language] || item.label.en}</span>
                    </button>
                    {hasChildren && (
                      <div className="nav-children">
                        {item.children.map((child) => (
                          <button key={child.key} type="button" className="nav-child" onClick={() => handleNavClick(child.key)}>
                            {child.label[language] || child.label.en}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </aside>

          <main className="dashboard-content">
            <div className="dashboard-panels">
              <section className="panel panel-blue">
                <header>
                  <h2>{newSubmission.title[language]}</h2>
                  <span className="panel-tag">{newSubmission.tag[language]}</span>
                </header>
                <div style={{ padding: 24 }}>
                  <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="journal" label={t.journal.label[language]} rules={[{ required: true, message: t.journal.required[language] }]}>
                      <Select
                        placeholder={t.journal.placeholder[language]}
                        options={journals.map((j) => ({ value: j.id || j.value || j, label: j.title || j.name || j.label || j }))}
                      />
                    </Form.Item>

                    <Form.Item name="category" label={t.category.label[language]} rules={[{ required: true, message: t.category.required[language] }]}>
                      <Select
                        placeholder={t.category.placeholder[language]}
                        options={[
                          { value: 'case-reports', label: t.category.options['case-reports'][language] },
                          { value: 'commentaries', label: t.category.options['commentaries'][language] },
                          { value: 'letters', label: t.category.options['letters'][language] },
                          { value: 'methodology-articles', label: t.category.options['methodology-articles'][language] },
                          { value: 'original-articles', label: t.category.options['original-articles'][language] },
                          { value: 'reports', label: t.category.options['reports'][language] },
                          { value: 'research-articles', label: t.category.options['research-articles'][language] },
                          { value: 'research-technical-notes', label: t.category.options['research-technical-notes'][language] },
                          { value: 'review-articles', label: t.category.options['review-articles'][language] }
                        ]}
                      />
                    </Form.Item>

                    <Form.Item name="title" label={t.title.label[language]} rules={[{ required: true, message: t.title.required[language] }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item name="authors" label={t.authors.label[language]} rules={[{ required: true, message: t.authors.required[language] }]}>
                      <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item name="abstract" label={t.abstract.label[language]} rules={[{ required: true, message: t.abstract.required[language] }]}>
                      <Input.TextArea rows={6} />
                    </Form.Item>

                    <Form.Item name="keywords" label={t.keywords.label[language]} rules={[{ required: true, message: t.keywords.required[language] }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item name="pages" label={t.pages.label[language]} rules={[{ required: true, message: t.pages.required[language] }]}>
                      <Select placeholder={t.pages.placeholder[language]} options={Array.from({ length: 50 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }))} />
                    </Form.Item>

                    <Form.Item name="fields" label={t.fields.label[language]} rules={[{ required: true, message: t.fields.required[language] }]}>
                      <Input.TextArea rows={3} />
                    </Form.Item>

                    <div className="form-item full-width">
                                    <label className="form-label">{language === 'zh' ? '上传论文文件' : 'Upload paper file'}</label>
                                    <div className="upload-container">
                                      <Input
                                        value={paperFile ? paperFile : ''}
                                        placeholder={language === 'zh' ? '请选择文件' : 'Please select file'}
                                        readOnly
                                        className="upload-input"
                                      />
                                      <Upload
                                        showUploadList={false}
                                        accept=".doc,.docx,.pdf,.txt,.zip,.rar,.7z"
                                        customRequest={handleRequestUpload}
                                      >
                                        <Button 
                                          icon={<UploadOutlined />}
                                          className="upload-btn"
                                        >
                                          { language === 'zh' ? '上传' : 'Upload' }
                                        </Button>
                                      </Upload>
                                    </div>
                    </div>

                    <div className="form-item full-width">
                      <label className="form-label">{t.code.label[language]}</label>
                      <div className="captcha-container">
                        <Form.Item
                          name="code"
                          noStyle
                          rules={[{ required: true, message: t.code.required[language] }]}
                        >
                          <Input className="captcha-input" />
                        </Form.Item>
                        <div className="captcha-image" onClick={generateCaptcha}>
                          {
                            captchaText ? 
                              <img src={captchaText} alt="captcha" />
                            :
                              <span className="captcha-text">{captchaText}</span>
                          }
                        </div>
                      </div>
                    </div>

                    <Form.Item>
                      <Button type="primary" htmlType="submit">{t.submit[language]}</Button>
                    </Form.Item>
                  </Form>
                </div>
              </section>
            </div>
          </main>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default NewSubmissionPage
