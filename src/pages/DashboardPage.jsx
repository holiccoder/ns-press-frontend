import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { authAPI } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { dashboardNavItems as navItems } from '../constants/dashboardNavItems'
import { dashboardPanelTranslations as panels } from '../constants/dashboardPanelTranslations'
import './DashboardPage.less'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [openMenus, setOpenMenus] = useState({
    'Quick Submission': true,
    'My Submission': true
  })

  const toggleMenu = (key, hasChildren) => {
    if (!hasChildren) return
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleNavClick = (key) => {
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
                    <tr>
                      <td colSpan="5" className="empty-row">{panels.submission.empty[language]}</td>
                    </tr>
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
