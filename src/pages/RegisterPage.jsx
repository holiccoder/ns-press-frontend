import React from 'react'
import { Form, Input, Button, message, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { authAPI } from '../services/api'
import { countryOptions } from '../constants/countries'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './RegisterPage.less'

const RegisterPage = () => {
  const { language } = useLanguage()
  const navigate = useNavigate()

  const texts = {
    zh: {
      title: '注册',
      name: '姓名',
      phone: '电话',
      titleField: '职称',
      degree: '学位',
      affiliation: '单位/机构',
      address: '地址',
      city: '城市',
      countryRegion: '国家/地区',
      email: '邮箱',
      password: '密码',
      confirm: '确认密码',
      submit: '注册'
    },
    en: {
      title: 'Register',
      name: 'Name',
      phone: 'Phone',
      titleField: 'Title',
      degree: 'Degree',
      affiliation: 'Affiliation',
      address: 'Address',
      city: 'City',
      countryRegion: 'Country/Region',
      email: 'Email',
      password: 'Password',
      confirm: 'Confirm Password',
      submit: 'Register'
    }
  }

  const titleOptions = ['Ms', 'Mr', 'Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor', 'Engineer']
  const degreeOptions = ['Bachelor', 'Master', 'Doctor']

  const onFinish = async (values) => {
    message.loading({ content: language === 'zh' ? '正在注册...' : 'Registering...', key: 'register' })
    try {
      const res = await authAPI.register({...values, channel:4, password_confirm: values.confirm})
      if (res?.code === 0) {
        message.error({ content: res?.msg || (language === 'zh' ? '注册失败' : 'Registration failed'), key: 'register' })
        return
      }
      message.success({ content: language === 'zh' ? '注册成功' : 'Registration successful', key: 'register' })
      navigate('/login')
    } catch (error) {
      message.error({ content: language === 'zh' ? '注册失败' : 'Registration failed', key: 'register' })
    }
  }

  const validatePasswords = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match'))
    }
  })

  return (
    <div className="register-page">
      <Header />
      <section className="auth-section">
        <div className="container">
          <div className="auth-form-box">
            <h2>{texts[language].title}</h2>
            <Form onFinish={onFinish} layout="vertical" className="auth-form">
              <Form.Item name="name" label={texts[language].name} rules={[{ required: true, message: language === 'zh' ? '请输入姓名' : 'Please enter your name' }]}>
                <Input />
              </Form.Item>

              <Form.Item name="account" type="email" label={texts[language].email} rules={[{ required: true, message: language === 'zh' ? '请输入邮箱' : 'Please enter email' }, { type: 'email', message: language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address' }]}>
                <Input />
              </Form.Item>

              <Form.Item name="password" label={texts[language].password} rules={[{ required: true, message: language === 'zh' ? '请输入密码' : 'Please enter password' }]}>
                <Input.Password />
              </Form.Item>

              <Form.Item name="confirm" label={texts[language].confirm} dependencies={["password"]} rules={[{ required: true, message: language === 'zh' ? '请确认密码' : 'Please confirm password' }, validatePasswords]}>
                <Input.Password />
              </Form.Item>

              <Form.Item name="phone" label={texts[language].phone} rules={[{ required: true, message: language === 'zh' ? '请输入电话' : 'Please enter phone' }]}>
                <Input />
              </Form.Item>

              <Form.Item name="title" label={texts[language].titleField} rules={[{ required: true, message: language === 'zh' ? '请选择职称' : 'Please select title' }]}>
                <Select options={titleOptions.map((value) => ({ value, label: value }))} />
              </Form.Item>

              <Form.Item name="degree" label={texts[language].degree} rules={[{ required: true, message: language === 'zh' ? '请选择学位' : 'Please select degree' }]}>
                <Select options={degreeOptions.map((value) => ({ value, label: value }))} />
              </Form.Item>

              <Form.Item name="affiliation" label={texts[language].affiliation} rules={[{ required: true, message: language === 'zh' ? '请输入单位/机构' : 'Please enter affiliation' }]}>
                <Input />
              </Form.Item>

              <Form.Item name="address" label={texts[language].address} rules={[{ required: true, message: language === 'zh' ? '请输入地址' : 'Please enter address' }]}>
                <Input />
              </Form.Item>

              <Form.Item name="city" label={texts[language].city} rules={[{ required: true, message: language === 'zh' ? '请输入城市' : 'Please enter city' }]}>
                <Input />
              </Form.Item>

              <Form.Item name="country" label={texts[language].countryRegion} rules={[{ required: true, message: language === 'zh' ? '请选择国家/地区' : 'Please select country/region' }]}>
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={countryOptions.map((value) => ({ value, label: value }))}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="auth-btn">{texts[language].submit}</Button>
              </Form.Item>

            

              <div className="auth-links">
                <a onClick={() => navigate('/login')}>{language === 'zh' ? '已有账户？登录' : 'Already have an account? Login'}</a>
              </div>
            </Form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default RegisterPage
