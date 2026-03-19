import { useEffect, useState } from 'react'

import { PlusOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useLanguage } from '../contexts/LanguageContext'
import { authAPI, submissionAPI } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { dashboardNavItems as navItems } from '../constants/dashboardNavItems'
import { dashboardPanelTranslations as panels } from '../constants/dashboardPanelTranslations'
import './DashboardPage.less'

const isValidIdentifier = (value) => value !== undefined && value !== null && value !== ''

const DashboardPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()

  const [openMenus, setOpenMenus] = useState({
    'Quick Submission': true,
    'My Submission': true
  })
  const [submissionList, setSubmissionList] = useState([])
  const [submissionLoading, setSubmissionLoading] = useState(true)
  const [submissionError, setSubmissionError] = useState(false)

  const loadingSubmissionText = language === 'zh' ? '加载中...' : 'Loading...'
  const errorSubmissionText = language === 'zh' ? '加载失败' : 'Failed to load'
  const emptySubmissionText = panels.submission.empty[language]

  const toggleMenu = (key, hasChildren) => {
    if (!hasChildren) return
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
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
      navigate('/dashboard/new-submission')
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


  const getValue = (item, keys, fallback = '--') => {
    for (const key of keys) {
      const value = item?.[key]
      if (value !== undefined && value !== null && value !== '') {
        return value
      }
    }
    return fallback
  }

  const formatDate = (value, fallback = '--') => {
    if (value === undefined || value === null || value === '') return fallback

    const normalizeTimestamp = (raw) => {
      const num = Number(raw)
      if (Number.isNaN(num)) return null
      if (num > 0 && num < 1e12) return num * 1000
      return num
    }

    let dateObj = null

    if (value instanceof Date) {
      dateObj = value
    } else if (typeof value === 'number') {
      dateObj = new Date(normalizeTimestamp(value))
    } else if (typeof value === 'string') {
      const trimmed = value.trim()
      const numericValue = normalizeTimestamp(trimmed)
      if (numericValue) {
        dateObj = new Date(numericValue)
      } else {
        const parsed = Date.parse(trimmed)
        dateObj = Number.isNaN(parsed) ? null : new Date(parsed)
      }
    }

    if (!dateObj || Number.isNaN(dateObj.getTime())) return fallback

    const locale = language === 'zh' ? 'zh-CN' : 'en-US'
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj)
  }

  const rawStatusFilter = searchParams.get('status')
  const statusFilter = rawStatusFilter === null || rawStatusFilter === '' ? null : Number(rawStatusFilter)
  const statusDisplayMap = {
    0: { en: 'Under Review', zh: '审稿中' },
    1: { en: 'Revised', zh: '已修改' },
    2: { en: 'Accepted', zh: '已录用' },
    3: { en: 'Withdrawal', zh: '退稿' },
    4: { en: 'Published', zh: '已发表' },
    5: { en: 'Rejected', zh: '已拒稿' },
    6: { en: 'Withdrawal', zh: '退稿' }
  }
  const statusAliasMap = {
    0: ['Under Review', '审稿中'],
    1: ['Revised', 'Need to Revise', '已修改', '需修改'],
    2: ['Accepted', '已录用'],
    3: ['Withdrawal', 'Withdrawn', 'Rejected', '退稿', '已拒稿'],
    4: ['Published', '已发表'],
    5: ['Rejected', '已拒稿'],
    6: ['Withdrawal', '退稿']
  }

  const getStatusCodeByText = (statusText) => {
    if (!isValidIdentifier(statusText)) return null

    const normalizedStatusText = String(statusText).trim()
    if (!normalizedStatusText) return null

    for (const [statusCode, aliases] of Object.entries(statusAliasMap)) {
      if (aliases.includes(normalizedStatusText)) {
        return Number(statusCode)
      }
    }

    return null
  }

  const matchesStatusFilter = (item) => {
    if (statusFilter === null || Number.isNaN(statusFilter)) return true

    const numericStatus = item?.status
    if (numericStatus !== undefined && numericStatus !== null && numericStatus !== '') {
      if (Number(numericStatus) === statusFilter) return true
    }

    const statusText = getValue(item, ['status_text', 'statusText', 'status'], null)
    if (!statusText) return false

    return statusAliasMap[statusFilter]?.includes(statusText) ?? false
  }

  const getDisplayStatus = (item) => {
    const statusValue = getValue(item, ['status'], null)
    const numericStatus = Number(statusValue)
    if (!Number.isNaN(numericStatus) && statusDisplayMap[numericStatus]) {
      return statusDisplayMap[numericStatus][language] || statusDisplayMap[numericStatus].en
    }

    const statusText = getValue(item, ['status_text', 'statusText', 'status'], null)
    const statusCodeByText = getStatusCodeByText(statusText)
    if (statusCodeByText !== null && statusDisplayMap[statusCodeByText]) {
      return statusDisplayMap[statusCodeByText][language] || statusDisplayMap[statusCodeByText].en
    }

    return isValidIdentifier(statusText) ? statusText : '--'
  }

  const visibleSubmissionList = submissionList.filter(matchesStatusFilter)



  useEffect(() => {
    let isMounted = true

    const fetchMyContribution = async () => {
      setSubmissionLoading(true)
      setSubmissionError(false)
      try {
        const response = await submissionAPI.getMyContribution()
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.list)
              ? response.list
              : Array.isArray(response?.rows)
                ? response.rows
                : []

        if (isMounted) {
          setSubmissionList(list)
        }
      } catch (error) {
        console.error('Failed to load my contribution:', error)
        if (isMounted) {
          setSubmissionList([])
          setSubmissionError(true)
        }
      } finally {
        if (isMounted) {
          setSubmissionLoading(false)
        }
      }
    }

    fetchMyContribution()

    return () => {
      isMounted = false
    }
  }, [])

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
                    <button
                      type="button"
                      className="nav-item"
                      onClick={() => toggleMenu(item.key, hasChildren)}
                      aria-expanded={hasChildren ? isOpen : undefined}
                    >
                      <span className="nav-icon">
                        <PlusOutlined />
                      </span>
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
                  <h2>{panels.submission.title[language]}</h2>
                  <span className="panel-tag">{panels.submission.tag[language]}</span>
                </header>
                <table>
                  <thead>
                    <tr>
                      <th>{panels.submission.columns.paperId[language]}</th>
                      <th>{panels.submission.columns.paperTitle[language]}</th>
                      <th>{panels.submission.columns.journal[language]}</th>
                      <th>{panels.submission.columns.status[language]}</th>
                      <th>{panels.submission.columns.submissionDate[language]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissionLoading && (
                      <tr>
                        <td colSpan="5" className="empty-row">{loadingSubmissionText}</td>
                      </tr>
                    )}
                    {!submissionLoading && submissionError && (
                      <tr>
                        <td colSpan="5" className="empty-row">{errorSubmissionText}</td>
                      </tr>
                    )}
                    {!submissionLoading && !submissionError && visibleSubmissionList.length === 0 && (
                      <tr>
                        <td colSpan="5" className="empty-row">{emptySubmissionText}</td>
                      </tr>
                    )}
                    {!submissionLoading && !submissionError && visibleSubmissionList.length > 0 && (
                      visibleSubmissionList.map((item, index) => {

                        const rowKey = item?.id
                          ?? item?.contribution_id
                          ?? item?.contributionId
                          ?? item?.contribute_id
                          ?? item?.paper_id
                          ?? item?.paperId
                          ?? `submission-${index}`
                        return (
                          <tr key={rowKey}>
                            <td>{getValue(item, ['paper_id', 'paperId', 'contribution_id', 'contributionId', 'contribute_id', 'id'])}</td>
                            <td>{getValue(item, ['paper_title', 'paperTitle', 'title'])}</td>
                            <td>{getValue(item, ['journal_name', 'journal', 'journalName'])}</td>
                            <td>{getDisplayStatus(item)}</td>
                            <td>{formatDate(getValue(item, ['create_time', 'submission_date', 'submissionDate', 'submitted_at', 'created_at']))}</td>


                          </tr>
                        )
                      })
                    )}
                  </tbody>

                </table>
              </section>

              <section className="panel panel-green">
                <header>
                  <h2>{panels.review.title[language]}</h2>
                  <span className="panel-tag">{panels.review.tag[language]}</span>
                </header>
                <table>
                  <thead>
                    <tr>
                      <th>{panels.review.columns.paperId[language]}</th>
                      <th>{panels.review.columns.paperTitle[language]}</th>
                      <th>{panels.review.columns.journal[language]}</th>
                      <th>{panels.review.columns.status[language]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="4" className="empty-row">{panels.review.empty[language]}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="panel panel-sky">
                <header>
                  <h2>{panels.editing.title[language]}</h2>
                  <span className="panel-tag">{panels.editing.tag[language]}</span>
                </header>
                <table>
                  <thead>
                    <tr>
                      <th>{panels.editing.columns.cover[language]}</th>
                      <th>{panels.editing.columns.journalName[language]}</th>
                      <th>{panels.editing.columns.subject[language]}</th>
                      <th>{panels.editing.columns.issn[language]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="4" className="empty-row">{panels.editing.empty[language]}</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>
          </main>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default DashboardPage
