import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import './Header.less'

const Header = () => {
  const location = useLocation()
  const { language, changeLanguage } = useLanguage()
  
  const navItems = [
    { zh: '首页', en: 'Home', path: '/' },
    { zh: '期刊', en: 'Journal', path: '/journals' },
    { zh: '图书', en: 'Book', path: '/books' },
    { zh: '关于我们', en: 'About Us', path: '/about' },
    { zh: '在线投稿', en: 'Online Submission', path: '/submission' },
    { zh: '信息指南', en: 'Information Guide', path: '/guide' }
  ]

  const handleLanguageToggle = (newLanguage) => {
    changeLanguage(newLanguage)
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img className='logo-img' src='https://baokan.tos-cn-beijing.volces.com/logo.png' />
        </div>
        
        <nav className="nav">
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item[language]}
            </Link>
          ))}
        </nav>
        
        <div className="language-toggle">
          <span 
            className={`lang-option ${language === 'zh' ? 'active' : ''}`}
            onClick={() => handleLanguageToggle('zh')}
          >
            中文
          </span>
          <span className="lang-separator">|</span>
          <span 
            className={`lang-option ${language === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageToggle('en')}
          >
            EN
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header
