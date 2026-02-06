import React, { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, Select, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { userAPI, authAPI } from '../services/api'
import './DashboardPage.less'

const titleOptions = ['Ms', 'Mr', 'Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor', 'Engineer']
const degreeOptions = ['Bachelor', 'Master', 'Doctor']
const countryOptions = ['China', 'United States', 'United Kingdom', 'Australia', 'Canada']

const navItems = [
  {
    label: 'Quick Submission',
    children: ['New Submission']
  },
  {
    label: 'My Submission',
    children: [
      'New Papers',
      'Under Review',
      'Need to Revise',
      'Accepted',
      'Published',
      'Rejected',
      'Withdrawal'
    ]
  },
  { label: 'My Review', children: ['Pending Review', 'Reviewed Papers'] },
  {
    label: 'My Editor-in-chief',
    children: [
      'Journal Management',
      'Manuscript Management',
      'Application Management'
    ]
  },
  {
    label: 'Join Us',
    children: [
      'All My Applications',
      'Join Review Team',
      'Join Editorial Board',
      'Join Editor-in-chief Group',
      'Recommend to Peer',
      'Recommend to Library'
    ]
  },
  {
    label: 'My Profile',
    children: ['Account Info', 'Logout']
  },
  { label: 'My System', children: ['home', 'Logout'] }
]

const AccountInfoPage = () => {
  const { language } = useLanguage()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [openMenus, setOpenMenus] = useState({ 'Quick Submission': true, 'My Submission': true })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getProfile()
        if (res?.code === 0) {
          return
        }
        if (res?.data) {
          form.setFieldsValue({
            name: res.data.name,
            phone: res.data.phone,
            title: res.data.title,
            degree: res.data.degree,
            affiliation: res.data.affiliation,
            city: res.data.city,
            country: res.data.country
          })
        }
      } catch (err) {
        // ignore
      }
    }
    fetchProfile()
  }, [form])

  const toggleMenu = (label, hasChildren) => {
    if (!hasChildren) return
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const handleNavClick = (label) => {
    if (label === 'Logout') {
      authAPI.logout()
      navigate('/login')
      return
    }

    if (label === 'New Submission') {
      navigate('/dashboard/new-submission')
      return
    }

    if (label === 'Account Info') {
      navigate('/dashboard/account-info')
      return
    }
    if (label === 'Join Editor-in-chief Group') {
      navigate('/dashboard/join-editor-in-chief')
      return
    }
  }

  const onFinish = async (values) => {
    message.loading({ content: language === 'zh' ? '正在保存...' : 'Saving...', key: 'save' })
    try {
      const res = await userAPI.updateProfile(values)
      if (res?.code === 0) {
        message.error({ content: res?.msg || (language === 'zh' ? '保存失败' : 'Save failed'), key: 'save' })
        return
      }
      message.success({ content: language === 'zh' ? '保存成功' : 'Saved', key: 'save' })
      navigate('/dashboard')
    } catch (err) {
      message.error({ content: language === 'zh' ? '保存失败' : 'Save failed', key: 'save' })
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
                const isOpen = Boolean(openMenus[item.label])
                return (
                  <div key={item.label} className={`nav-group ${hasChildren ? 'has-children' : ''} ${isOpen ? 'is-open' : ''}`}>
                    <button type="button" className="nav-item" onClick={() => toggleMenu(item.label, hasChildren)} aria-expanded={hasChildren ? isOpen : undefined}>
                      <span className="nav-icon"><PlusOutlined /></span>
                      <span className="nav-label">{item.label}</span>
                    </button>
                    {hasChildren && (
                      <div className="nav-children">
                        {item.children.map((child) => (
                          <button key={child} type="button" className="nav-child" onClick={() => handleNavClick(child)}>
                            {child}
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
                  <h2>{language === 'zh' ? '账户信息' : 'Account Info'}</h2>
                  <span className="panel-tag">{language === 'zh' ? '账户' : 'Account'}</span>
                </header>
                <div style={{ padding: 24 }}>
                  <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="name" label={language === 'zh' ? '姓名' : 'Name'} rules={[{ required: true, message: language === 'zh' ? '请输入姓名' : 'Please enter your name' }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item name="phone" label={language === 'zh' ? '电话' : 'Phone'} rules={[{ required: true, message: language === 'zh' ? '请输入电话' : 'Please enter phone' }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item name="title" label={language === 'zh' ? '职称' : 'Title'} rules={[{ required: true, message: language === 'zh' ? '请选择职称' : 'Please select title' }]}>
                      <Select options={titleOptions.map((v) => ({ value: v, label: v }))} />
                    </Form.Item>

                    <Form.Item name="degree" label={language === 'zh' ? '学位' : 'Degree'} rules={[{ required: true, message: language === 'zh' ? '请选择学位' : 'Please select degree' }]}>
                      <Select options={degreeOptions.map((v) => ({ value: v, label: v }))} />
                    </Form.Item>

                    <Form.Item name="affiliation" label={language === 'zh' ? '单位/机构' : 'Affiliation'} rules={[{ required: true, message: language === 'zh' ? '请输入单位/机构' : 'Please enter affiliation' }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item name="city" label={language === 'zh' ? '城市' : 'City'} rules={[{ required: true, message: language === 'zh' ? '请输入城市' : 'Please enter city' }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item name="country" label={language === 'zh' ? '国家/地区' : 'Country/Region'} rules={[{ required: true, message: language === 'zh' ? '请选择国家/地区' : 'Please select country' }]}>
                      <Select options={countryOptions.map((v) => ({ value: v, label: v }))} />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit">{language === 'zh' ? '保存' : 'Save'}</Button>
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

export default AccountInfoPage
