import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
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
  { label: 'My Editor-in-chief',
    children: ['Journal Management',
       'Manuscript Management', 
       'Application Management',
      ]
   },
  { label: 'Join Us',
    children: [
      'All My Applications',
      'Join Review Team',
      'Join Editorial Board',
      'Join Editor-in-chief Group',
      'Recommend to Peer',
      'Recommend to Library', 
    ]
   },
  {
    label: 'My Profile',
    children: ['Account Info', 'Logout']
  },
  { label: 'My System', children: ['home', 'Logout'] }
]

const DashboardPage = () => {
  const navigate = useNavigate()
  const [openMenus, setOpenMenus] = useState({
    'Quick Submission': true,
    'My Submission': true
  })

  const toggleMenu = (label, hasChildren) => {
    if (!hasChildren) return
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }))
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
                      <span className="nav-icon">
                        <PlusOutlined />
                      </span>
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
                  <h2>All My Submission</h2>
                  <span className="panel-tag">Author</span>
                </header>
                <table>
                  <thead>
                    <tr>
                      <th>Paper ID</th>
                      <th>Paper Title</th>
                      <th>Journal</th>
                      <th>Status</th>
                      <th>Submission Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" className="empty-row">No submissions yet.</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="panel panel-green">
                <header>
                  <h2>All My Review</h2>
                  <span className="panel-tag">Reviewer</span>
                </header>
                <table>
                  <thead>
                    <tr>
                      <th>Paper ID</th>
                      <th>Paper Title</th>
                      <th>Journal</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="4" className="empty-row">No review assignments yet.</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="panel panel-sky">
                <header>
                  <h2>All My Editing</h2>
                  <span className="panel-tag">Editor</span>
                </header>
                <table>
                  <thead>
                    <tr>
                      <th>Cover</th>
                      <th>Journal Name</th>
                      <th>Subject</th>
                      <th>ISSN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="4" className="empty-row">No editing records yet.</td>
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
