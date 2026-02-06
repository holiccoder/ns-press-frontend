import React, { useState, useEffect } from 'react'
import { Select, Input, Button, Upload, message, Form } from 'antd'
import { SendOutlined, UploadOutlined } from '@ant-design/icons'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { submissionAPI, journalAPI, guideAPI } from '../services/api'
import './SubmissionPage.less'

const { TextArea } = Input
const { Option } = Select

const SubmissionPage = () => {
  const { language } = useLanguage()
  const [form] = Form.useForm()
  const [formData, setFormData] = useState({
    journal: '',
    name: '',
    mobile: '',
    email: '',
    file: null,
    article: null,
    introduction: '',
    code: ''
  })
  const [captchaText, setCaptchaText] = useState('')
  const [isGetCaptcha, setIsGetCaptcha] = useState(false);
  const [journalList, setJournalList] = useState([]);
  const [guideData, setGuideData] = useState({})

  // 手机号验证规则
  const validateMobile = (rule, value) => {
    if (!value) {
      return Promise.reject(language === 'zh' ? '请输入手机号' : 'Please enter your phone number')
    }
    if (!/^1[3-9]\d{9}$/.test(value)) {
      return Promise.reject(language === 'zh' ? '请输入正确的11位手机号' : 'Please enter a valid 11-digit phone number')
    }
    return Promise.resolve()
  }

  // 邮箱验证规则
  const validateEmail = (rule, value) => {
    if (!value) {
      return Promise.reject(language === 'zh' ? '请输入邮箱地址' : 'Please enter your email address')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return Promise.reject(language === 'zh' ? '请输入正确的邮箱格式' : 'Please enter a valid email format')
    }
    return Promise.resolve()
  }

  const submissionData = {
    zh: {
      title: '在线投稿',
      subtitle: 'Online Submission',
      emailTitle: '在线快捷投稿：',
      guidelines: '此处仅为在线快捷投稿通道，为广大作者的投稿提供便捷，用户选择意向期刊后即可直接投稿，但无法显示文章状态等，需要等候工作人员的联系，且可能需要较长时间。如有介意，请移步至对应期刊页面进行投稿。',
      emailTitle2: '来稿要求：',
      guidelines2: '文章论点明确，论据可靠，逻辑严谨，图表清晰，字数在5000字符左右或以上为宜；论文的基本要素齐全：标题、作者姓名、作者单位、摘要、关键词、参考文献等。文稿请用word格式。所投稿件需保证文章版权的独立性，文责自负，请勿一稿多投。',
      form: {
        journal: '投稿期刊',
        name: '您的名字',
        mobile: '您的手机号',
        email: '您的E-mail',
        file: '上传文章',
        introduction: '您的个人简介',
        code: '验证码',
        submit: '立即提交',
        uploadBtn: '上传文档',
        introductionPlaceholder: '请输入您的个人简介'
      },
      journals: [
        '人文与社会科学',
        '自然科学与技术',
        '医学与健康科学',
        '工程技术与应用',
        '教育与心理学研究'
      ]
    },
    en: {
      title: 'Online Submission',
      subtitle: '在线投稿',
      emailTitle: 'Online Quick Submission',
      guidelines: 'This is a quick online submission channel designed to facilitate submissions. Users can submit directly after selecting their intended journal. However, the status of the article will not be displayed. You will need to wait for staff to contact you, and this may take a long time. If you mind, please go to the corresponding journal page to submit your article.',
      emailTitle2: 'Manuscript Requirements',
      guidelines2: 'The article should have a clear thesis, reliable evidence, rigorous logic, and clear figures and tables. The word count should be around 5,000 characters or more. The article should include all the essential elements of the article: title, author names, affiliations, abstract, keywords, references, etc. Manuscripts should be formatted in Word. Submitted articles must maintain copyright independence. The author is solely responsible for the content of the article. Please do not submit the same article to multiple publications.',
      form: {
        journal: 'Submission Journal',
        name: 'Your Name',
        mobile: 'Your Phone Number',
        email: 'Your E-mail',
        file: 'Upload Article',
        introduction: 'Your Personal Introduction',
        code: 'Verification Code',
        submit: 'Submit Now',
        uploadBtn: 'Upload Document',
        introductionPlaceholder: 'Please enter your personal introduction'
      },
      journals: [
        'Humanities and Social Sciences',
        'Natural Sciences and Technology',
        'Medical and Health Sciences',
        'Engineering Technology and Applications',
        'Education and Psychology Research'
      ]
    }
  }

  useEffect(() => {
    if (!isGetCaptcha) {
      setIsGetCaptcha(true)
      submissionAPI.captcha().then(res => {
        setCaptchaText(res.data.image);
      })
    }
  }, [isGetCaptcha])

  useEffect(() => {
    journalAPI.getJournalList(1,500).then(res => {
      setJournalList(res.data.lists)
    })
    guideAPI.getAuthorGuide().then(res => {
      setGuideData(res.data);
    })
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      article: file
    }))
    message.success(language === 'zh' ? '文件上传成功' : 'File uploaded successfully')
    return false // 阻止默认上传行为
  }

  const handleRequestUpload = ({ file, onSuccess, onError }) => {   
    console.log(file)
    submissionAPI.uploadFile(file).then(res => {
      console.log(res)
      setFormData(prev => ({
        ...prev,
        file: res.data.uri,
        article: file
      }))

      onSuccess()
    }).catch(err => {
      onError(err)
    })
  }

  const generateCaptcha = () => {
    setIsGetCaptcha(false)
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 验证表单
      if (!formData.journal || !formData.file || !formData.introduction || !formData.code) {
        message.error(language === 'zh' ? '请填写所有必填字段' : 'Please fill in all required fields')
        return
      }

      // if (formData.code.toLowerCase() !== captchaText.toLowerCase()) {
      //   message.error(language === 'zh' ? '验证码错误' : 'Incorrect verification code')
      //   return
      // }

      // 提交表单
      const submitData = {
        ...formData,
        ...values,
        journal_id: formData.journal,
        Introduction: formData.introduction
      }
      
      console.log('Form submitted:', submitData)

      submissionAPI.submitArticle(submitData).then(res => {   
        if (res.code === 0) {
          message.error(res.msg)
        } else {
          message.success(language === 'zh' ? '投稿提交成功！' : 'Submission successful!')
          setFormData({
            journal: '',
            name: '',
            mobile: '',
            email: '',
            file: null,
            article: null,
            introduction: '',
            code: ''
          })
          form.resetFields()
          generateCaptcha();
        }
       
        
      }).catch(err => {
        message.error(language === 'zh' ? '投稿提交失败！' : 'Submission failed!')
      })
    }).catch(errorInfo => {
      console.log('Validation failed:', errorInfo)
    })
  }

  return (
    <div className="submission-page">
      <Header />
      
      {/* Banner Section */}
      <section className="submission-banner">
        <div className="submission-banner-content banner-content">
          <div className="guidelines-box">
            {/* <h1 className="email-title">{submissionData[language].emailTitle}</h1> */}
            <div className="guidelines" dangerouslySetInnerHTML={{ __html: guideData.submission_notice }}>
            </div>
          </div>
          {/* <div className="guidelines-box">
            <h1 className="email-title">{submissionData[language].emailTitle2}</h1>
            <div className="guidelines">
              {submissionData[language].guidelines2}
            </div>
          </div> */}
        </div>
      </section>

      {/* Submission Form Section */}
      <section className="submission-form-section">
        <div className="container">
          <div className="form-container">
            <Form form={form} className="submission-form">
              {/* Journal Selection */}
              <div className="form-item">
                <label className="form-label">{submissionData[language].form.journal}</label>
                <Select
                  placeholder={language === 'zh' ? '下拉菜单' : 'Dropdown menu'}
                  value={formData.journal}
                  onChange={(value) => handleInputChange('journal', value)}
                  className="form-select"
                >
                  {journalList.map((journal, index) => (
                    <Option key={index} value={journal.id}>{journal.title}</Option>
                  ))}
                </Select>
              </div>

              {/* Name */}
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: language === 'zh' ? '请输入您的姓名' : 'Please enter your name'
                  }
                ]}
                className="form-item"
              >
                <div>
                  <label className="form-label">{submissionData[language].form.name}</label>
                  <Input className="form-input" />
                </div>
              </Form.Item>

              {/* Mobile */}
              <Form.Item
                name="mobile"
                rules={[
                  {
                    validator: validateMobile
                  }
                ]}
                className="form-item"
              >
                <div>
                  <label className="form-label">{submissionData[language].form.mobile}</label>
                  <Input className="form-input" />
                </div>
              </Form.Item>

              {/* Email */}
              <Form.Item
                name="email"
                rules={[
                  {
                    validator: validateEmail
                  }
                ]}
                className="form-item"
              >
                <div>
                  <label className="form-label">{submissionData[language].form.email}</label>
                  <Input className="form-input" />
                </div>
              </Form.Item>

              {/* Article Upload */}
              <div className="form-item full-width">
                <label className="form-label">{submissionData[language].form.file}</label>
                <div className="upload-container">
                  <Input
                    value={formData.file ? formData.article.name : ''}
                    placeholder={language === 'zh' ? '请选择文件' : 'Please select file'}
                    readOnly
                    className="upload-input"
                  />
                  <Upload
                    // beforeUpload={handleFileUpload}
                    showUploadList={false}
                    accept=".doc,.docx,.pdf,.txt,.zip,.rar,.7z"
                    customRequest={handleRequestUpload}
                  >
                    <Button 
                      icon={<UploadOutlined />}
                      className="upload-btn"
                    >
                      {submissionData[language].form.uploadBtn}
                    </Button>
                  </Upload>
                </div>
              </div>

              {/* Introduction */}
              <div className="form-item full-width">
                <label className="form-label">{submissionData[language].form.introduction}</label>
                <TextArea
                  value={formData.introduction}
                  onChange={(e) => handleInputChange('introduction', e.target.value)}
                  placeholder={submissionData[language].form.introductionPlaceholder}
                  rows={6}
                  className="form-textarea"
                />
              </div>

              {/* Captcha */}
              <div className="form-item full-width">
                <label className="form-label">{submissionData[language].form.code}</label>
                <div className="captcha-container">
                  <Input
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    className="captcha-input"
                  />
                  <div className="captcha-image" onClick={generateCaptcha}>
                    {/* <span className="captcha-text">{captchaText}</span> */}
                    {
                      captchaText ? 
                        <img src={captchaText} alt="captcha" />
                      :
                        <span className="captcha-text">{captchaText}</span>
                    }
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-item submit-item full-width">
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  className="submit-btn"
                  size="large"
                >
                  {submissionData[language].form.submit}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default SubmissionPage
