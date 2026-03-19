import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { authAPI, setToken } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './LoginPage.less'

const LoginPage = () => {
  const { language } = useLanguage()
  const navigate = useNavigate()

  const texts = {
    zh: {
      title: '登录',
      email: '邮箱',
      password: '密码',
      submit: '登录',
      forgot: '忘记密码?',
      register: '没有账户？立即注册'
    },
    en: {
      title: 'Login',
      email: 'Email',
      password: 'Password',
      submit: 'Login',
      forgot: 'Forgot password?',
      register: "Don't have an account? Register"
    }
  }

  const onFinish = async (values) => {
    message.loading({ content: language === 'zh' ? '正在登录...' : 'Logging in...', key: 'login' })
    try {
      const res = await authAPI.login({ ...values, terminal: 1, 'scene':1})
      if (res?.code === 0) {
        message.error({ content: res?.msg || (language === 'zh' ? '登录失败' : 'Login failed'), key: 'login' })
        return
      }
      // Save token if present in response
      if (res?.data?.token) {
        setToken(res.data.token)
      }
      // Save user session fields if present in response
      const sessionSource = res?.data?.user || res?.data?.profile || res?.data
      if (sessionSource) {
        const userSession = {
          user_id: sessionSource.user_id,
          real_name: sessionSource.real_name,
          title: sessionSource.title,
          degree: sessionSource.degree,
          affiliation: sessionSource.affiliation,
          city: sessionSource.city,
          country: sessionSource.country,
          address: sessionSource.address,
          intro: sessionSource.intro,
          account: sessionSource.account,
          phone: sessionSource.mobile,
        }
        localStorage.setItem('userProfile', JSON.stringify(userSession))
      }
      message.success({ content: language === 'zh' ? '登录成功' : 'Login successful', key: 'login' })
      navigate('/dashboard')
    } catch (error) {
      message.error({ content: language === 'zh' ? '登录失败' : 'Login failed', key: 'login' })
    }
  }

  return (
    <div className="login-page">
      <Header />
      <section className="auth-section">
        <div className="container">
          <div className="auth-form-box">
            <h2>{texts[language].title}</h2>
            <Form onFinish={onFinish} layout="vertical" className="auth-form">
              <Form.Item name="account" label={texts[language].email} rules={[{ required: true, message: language === 'zh' ? '请输入邮箱' : 'Please enter email' }]}>
                <Input />
              </Form.Item>

              <Form.Item name="password" label={texts[language].password} rules={[{ required: true, message: language === 'zh' ? '请输入密码' : 'Please enter password' }]}>
                <Input.Password style={{  }} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="auth-btn">{texts[language].submit}</Button>
              </Form.Item>

              <div className="auth-links">
                <a onClick={() => navigate('/forgot-password')}>{texts[language].forgot}</a>
                <a onClick={() => navigate('/register')}>{texts[language].register}</a>
              </div>
            </Form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default LoginPage
