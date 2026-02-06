import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ForgotPasswordPage.less'

const ForgotPasswordPage = () => {
  const { language } = useLanguage()
  const navigate = useNavigate()

  const texts = {
    zh: {
      title: '忘记密码',
      email: '邮箱',
      submit: '发送重置密码链接',
      back: '返回登录'
    },
    en: {
      title: 'Forgot Password',
      email: 'Email',
      submit: 'Send Reset Link',
      back: 'Back to Login'
    }
  }

  const onFinish = (values) => {
    message.loading({ content: language === 'zh' ? '正在发送重置链接...' : 'Sending...', key: 'forgot' })
    // Simulate API request
    setTimeout(() => {
      message.success({ content: language === 'zh' ? '已发送重置链接' : 'Reset link sent', key: 'forgot' })
      navigate('/login')
    }, 800)
  }

  return (
    <div className="forgot-password-page">
      <Header />
      <section className="auth-section">
        <div className="container">
          <div className="auth-form-box">
            <h2>{texts[language].title}</h2>
            <Form onFinish={onFinish} layout="vertical" className="auth-form">
              <Form.Item name="email" label={texts[language].email} rules={[{ required: true, message: language === 'zh' ? '请输入邮�?' : 'Please enter email' }, { type: 'email', message: language === 'zh' ? '请输入有效的邮箱' : 'Please enter a valid email' }]}>
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="auth-btn">{texts[language].submit}</Button>
              </Form.Item>

              <div className="auth-links">
                <a onClick={() => navigate('/login')}>{texts[language].back}</a>
              </div>
            </Form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default ForgotPasswordPage
