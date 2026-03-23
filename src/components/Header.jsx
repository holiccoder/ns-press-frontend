import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { authAPI, getToken, userAPI } from '../services/api'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import './Header.less'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { language, changeLanguage } = useLanguage()
  const [user, setUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAuthenticated = Boolean(getToken())
  
  const navItems = [
    { zh: '首页', en: 'Home', path: '/' },
    { zh: '期刊', en: 'Journal', path: '/journals' },
    { zh: '图书', en: 'Book', path: '/books' },
    { zh: '关于我们', en: 'About Us', path: '/about' },
    { zh: '信息指南', en: 'Information Guide', path: '/guide' }
  ]

  const handleLanguageToggle = (newLanguage) => {
    changeLanguage(newLanguage)
  }

  const handleLogout = async () => {
    await authAPI.logout()
    navigate('/login')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) {
        setUser(null)
        return
      }
      try {
        const res = await userAPI.getProfile()
        if (res?.data) {
          setUser(res.data)
        }
      } catch (err) {
        // ignore
      }
    }
    fetchProfile()
  }, [isAuthenticated, location.pathname])

  const displayName = user?.name || user?.username || user?.email || 'User'
  const avatarUrl = user?.avatar || user?.avatar_url || user?.headimg
  const avatarInitial = displayName?.trim()?.[0]?.toUpperCase() || 'U'

  return (
    <header className="header">
      <header className="top-bar" style={{ marginBottom: '10px' }}>

        <div className="top-bar-container">
            <div className="top-bar__left">{language === 'zh' ? '欢迎来到香港自然科学出版社' : 'Welcome to NS-press.com'}</div>
            <nav className="top-bar__right">
              {isAuthenticated ? (
                <div className="top-bar__user-menu">
                  <button
                    type="button"
                    className="top-bar__user-button"
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    {avatarUrl ? (
                      <img className="top-bar__avatar" src={avatarUrl} alt={displayName} />
                    ) : (
                      <span className="top-bar__avatar top-bar__avatar--placeholder">{avatarInitial}</span>
                    )}
                    <span className="top-bar__name">{displayName}</span>
                  </button>
                  <div className="top-bar__dropdown" role="menu">
                    <Link to="/dashboard/account-info" role="menuitem">
                      Account
                    </Link>
                    <button type="button" role="menuitem" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login">{language === 'zh' ? '登录' : 'Login'}</Link>
                  <Link to="/register">{language === 'zh' ? '注册' : 'Register'}</Link>
                </>
              )}
            </nav>
        </div>
           
      </header>
      <div className="header-container">
        <div className="logo">
          <img className='logo-img' src='https://api.ns-press.com/uploads/images/website/logo.png' />
        </div>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
        
        <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {language === 'zh' ? item.zh : item.en}
            </Link>
          ))}
          <div className="language-toggle">
            <span 
              className={`lang-option ${language === 'zh' ? 'active' : ''}`}
              onClick={() => handleLanguageToggle('zh')}
            >
              CN
            </span>
            <span className="lang-separator">/</span>
            <span 
              className={`lang-option ${language === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageToggle('en')}
            >
              EN
            </span>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
