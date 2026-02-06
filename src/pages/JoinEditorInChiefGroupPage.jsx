import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Upload, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './DashboardPage.less'

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

const JoinEditorInChiefGroupPage = () => {
  const navigate = useNavigate()
  const [openMenus, setOpenMenus] = React.useState({
    'Join Us': true
  })
  const [cvFile, setCvFile] = React.useState(null)
  const [form] = Form.useForm()

  const toggleMenu = (label, hasChildren) => {
    if (!hasChildren) return
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }))
  }

  const handleNavClick = (label) => {
    if (label === 'Logout') {
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
    message.loading({ content: 'Submitting...', key: 'join-eic' })
    try {
      // TODO: wire to API when endpoint is available
      if (!cvFile) {
        message.error({ content: 'Please upload your CV', key: 'join-eic' })
        return
      }
      message.success({ content: 'Submitted', key: 'join-eic' })
      form.resetFields()
      setCvFile(null)
    } catch (err) {
      message.error({ content: 'Submission failed', key: 'join-eic' })
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
                    <button
                      type="button"
                      className="nav-item"
                      onClick={() => toggleMenu(item.label, hasChildren)}
                      aria-expanded={hasChildren ? isOpen : undefined}
                    >
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
                  <h2>Join Editor-in-chief Group</h2>
                  <span className="panel-tag">Join Us</span>
                </header>
                <div style={{ padding: 24 }}>
                  <section style={{ marginBottom: 24 }}>
                    <p>Please submit your complete profile to join the Editor-in-chief Group. Benefits include:</p>
                    <ul style={{ paddingLeft: 18, marginTop: 8 }}>
                      <li>Receiving a certificate from Francis Press.</li>
                      <li>The opportunity to cooperate with experienced researchers worldwide.</li>
                      <li>Having the editor's name and personal webpage displayed on the journal's website.</li>
                      <li>Being awarded a certificate for your contribution.</li>
                    </ul>
                  </section>

                  <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                      name="journal"
                      label="Select A Journal"
                      rules={[{ required: true, message: 'Please select a journal' }]}
                    >
                      <Select
                        options={[
                          {
                            value: 'Academic Journal of Agriculture & Life Sciences',
                            label: 'Academic Journal of Agriculture & Life Sciences'
                          }
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Upload Your CV"
                      name="cv"
                      rules={[
                        {
                          validator: () => {
                            if (cvFile) return Promise.resolve()
                            return Promise.reject(new Error('Please upload your CV'))
                          }
                        }
                      ]}
                    >
                      <Upload
                        beforeUpload={(file) => {
                          setCvFile(file)
                          return false
                        }}
                        maxCount={1}
                        accept=".pdf,.doc,.docx"
                      >
                        <Button>浏览...</Button>
                      </Upload>
                      <div style={{ marginTop: 8, color: '#666' }}>
                        Only .pdf, .doc, .docx formats are accepted. Maximum file size is 5 MB.
                      </div>
                      {cvFile && <div style={{ marginTop: 6 }}>{cvFile.name}</div>}
                    </Form.Item>

                    <Form.Item
                      name="website"
                      label="Personal Website Link"
                      rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                    >
                      <Input placeholder="https://your-website.com" />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit">Submit</Button>
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

export default JoinEditorInChiefGroupPage
