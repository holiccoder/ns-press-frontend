import React, { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, Select, Button, Upload, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { submissionAPI } from '../services/api'
import './DashboardPage.less'

const navItems = [
  { label: 'Quick Submission', children: ['New Submission'] },
  { label: 'My Submission', children: ['New Papers', 'Under Review', 'Need to Revise', 'Accepted', 'Published', 'Rejected', 'Withdrawal'] },
  { label: 'My Review', children: ['Pending Review', 'Reviewed Papers'] },
  { label: 'My Profile', children: ['Account Info', 'Logout'] }
]

const NewSubmissionPage = () => {
  const navigate = useNavigate()
  const [openMenus, setOpenMenus] = useState({ 'Quick Submission': true, 'My Submission': true })
  const [journals, setJournals] = useState([])
  const [paperFile, setPaperFile] = useState(null)
  const [graphicFile, setGraphicFile] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    // fetch journal options if available
    const fetchJournals = async () => {
      try {
        const res = await submissionAPI.getJournalOptions()
        if (res?.code !== 0 && res?.data) {
          setJournals(res.data)
        }
      } catch (err) {
        // ignore
      }
    }
    fetchJournals()
  }, [])

  const toggleMenu = (label, hasChildren) => {
    if (!hasChildren) return
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const handleNavClick = (label) => {
    if (label === 'Logout') {
      // reuse authAPI.logout from services if needed
      navigate('/login')
      return
    }

    if (label === 'New Submission') {
      // already on this page
      return
    }
    if (label === 'Account Info') {
      navigate('/dashboard/account-info')
      return
    }
  }

  const beforeUploadPrevent = (file) => {
    // Prevent auto upload; we'll attach files to FormData on submit
    return false
  }

  const onFinish = async (values) => {
    message.loading({ content: 'Submitting...', key: 'submit' })
    try {
      const formData = new FormData()
      // append fields
      formData.append('journal', values.journal)
      formData.append('category', values.category)
      formData.append('title', values.title)
      formData.append('authors', values.authors)
      formData.append('abstract', values.abstract)
      formData.append('keywords', values.keywords)
      formData.append('pages', values.pages)
      formData.append('fields', values.fields)
      if (paperFile) formData.append('paper_file', paperFile)
      if (graphicFile) formData.append('graphic_file', graphicFile)

      const res = await submissionAPI.submitArticle(formData)
      if (res?.code === 0) {
        message.error({ content: res?.msg || 'Submission failed', key: 'submit' })
        return
      }
      message.success({ content: 'Submission successful', key: 'submit' })
      navigate('/dashboard')
    } catch (err) {
      message.error({ content: 'Submission failed', key: 'submit' })
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
                  <h2>New Submission</h2>
                  <span className="panel-tag">Author</span>
                </header>
                <div style={{ padding: 24 }}>
                  <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="journal" label="Journal" rules={[{ required: true }]}>
                      <Select placeholder="Select journal" options={journals.map((j) => ({ value: j.id || j.value || j, label: j.name || j.label || j }))} />
                    </Form.Item>

                    <Form.Item name="category" label="Paper Category" rules={[{ required: true }]}>
                      <Select placeholder="Select category" options={[{ value: 'research', label: 'Research Article' }, { value: 'review', label: 'Review' }, { value: 'case', label: 'Case Study' }]} />
                    </Form.Item>

                    <Form.Item name="title" label="Paper Title" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item name="authors" label="Author List" rules={[{ required: true }]}>
                      <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item name="abstract" label="Abstract" rules={[{ required: true }]}>
                      <Input.TextArea rows={6} />
                    </Form.Item>

                    <Form.Item name="keywords" label="Keywords" rules={[{ required: true, message: 'Please enter keywords' }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item name="pages" label="Number of Pages" rules={[{ required: true, message: 'Please select number of pages' }]}>
                      <Select placeholder="Pages" options={Array.from({ length: 50 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }))} />
                    </Form.Item>

                    <Form.Item name="fields" label="Paper Fields" rules={[{ required: true, message: 'Please enter paper fields' }]}>
                      <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                      label="Paper File"
                      name="paper_file"
                      rules={[
                        {
                          validator: () => {
                            if (paperFile) {
                              return Promise.resolve()
                            }
                            return Promise.reject(new Error('Please upload the paper file'))
                          }
                        }
                      ]}
                    >
                      <Upload beforeUpload={(file) => { setPaperFile(file); return false; }} maxCount={1}>
                        <Button>Choose File</Button>
                      </Upload>
                      {paperFile && <div style={{ marginTop: 8 }}>{paperFile.name}</div>}

                      <div style={{ marginTop: 12, padding: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 4, color: '#664d03' }}>
                        <div>Please make sure to close the file you want to upload.</div>
                        <div>doc,docx,pdf,zip,rar formats are accepted. Maximum file size is 10 MB.</div>
                      </div>
                    </Form.Item>

                    <Form.Item label="Graphic File">
                      <Upload beforeUpload={(file) => { setGraphicFile(file); return false; }} maxCount={1}>
                        <Button>Choose File</Button>
                      </Upload>
                      {graphicFile && <div style={{ marginTop: 8 }}>{graphicFile.name}</div>}

                      <div style={{ marginTop: 12, padding: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 4, color: '#664d03' }}>
                        <div>Please make sure to close the file you want to upload.</div>
                        <div>jpg,jpeg,gif,png,tif,psd,eps,rar,zip formats are accepted. Maximum file size is 20 MB.</div>
                        <div>(Before uploading multiple pictures, please compress them into a .zip or .rar file.)</div>
                      </div>
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

export default NewSubmissionPage
