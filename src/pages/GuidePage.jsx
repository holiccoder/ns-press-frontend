import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './GuidePage.less'
import { guideAPI } from '../services/api'

const GuidePage = () => {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('author_guide')
  const [guideData, setGuideData] = useState({})
  const [tabData, setTabData] = useState({
    zh: [
      { type: 'author_guide', label: '作者指南' },
      { type: 'reviewer_guide', label: '审稿人指南' },
      { type: 'open_access', label: '开放获取' },
    ],
    en: [
      { type: 'author_guide', label: 'Author Guide' },
      { type: 'reviewer_guide', label: 'Reviewer Guide' },
      { type: 'open_access', label: 'Open Access' },
    ]
  })

  const titleData = {
    zh: {
      title: '信息指南',
      subtitle: 'Information Guide'
    },
    en: {
      title: 'Information Guide',
      subtitle: '信息指南'
    }
  }

  useEffect(() => {
    guideAPI.getAuthorGuide().then(res => {
      setGuideData(res.data);
    })
  }, [])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  return (
    <div className="guide-page">
      <Header />
      
      {/* Banner Section */}
      <section className="guide-banner">
        <div className="banner-content">
          <h1 className="banner-title">{titleData[language].title}</h1>
          <p className="banner-subtitle">{titleData[language].subtitle}</p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="navigation-tabs">
        <div className="container">
          <div className="tabs">
            {tabData[language].map((tab) => (
              <button 
                key={tab.type}
                className={`tab-nav-btn ${activeTab === tab.type ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.type)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="guide-content-section content-section">
        <div className="guide-container">
          <div className="content-wrapper">
            {
              activeTab === 'author_guide' && (
                <div className="content-block" dangerouslySetInnerHTML={{ __html: guideData.author_guide }}></div>
              )
            }
            {
              activeTab === 'reviewer_guide' && (
                <div className="content-block" dangerouslySetInnerHTML={{ __html: guideData.reviewer_guide }}></div>
              )
            }
            {
              activeTab === 'open_access' && (
                <div className="content-block" dangerouslySetInnerHTML={{ __html: guideData.open_policy }}></div>
              )
            }
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default GuidePage