import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from 'antd'
import { FilePdfOutlined } from '@ant-design/icons'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './BookDetailPage.less'
import { bookAPI } from '../services/api'

const BookDetailPage = () => {
  const { id } = useParams()
  const { language } = useLanguage()
  const [bookData, setBookData] = useState({})
  useEffect(() => {
    if (id) {
      bookAPI.getBookDetail(id).then(res => {
        setBookData(res.data)
      })
    }
  }, [id])

  const handleDownloadPDF = () => {
    const link = document.createElement('a')
    link.href = '#'
    // link.download = `${bookData.title}.pdf`
    link.download = `${bookData.content}`
    link.click()
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="book-detail-page">
      <Header />
      
      {/* Banner Section */}
      <section className="book-detail-banner">
        <div className="banner-content">
          <h1 className="banner-title">{bookData.title}</h1>
        </div>
      </section>

      {/* Book Introduction Section */}
      <section className="book-introduction-section">
        <div className="container">
          <div className="book-introduction">
            <div className="book-cover">
              <img className="book-placeholder" src={bookData.cover_image} />
            </div>
            <div className="book-info">
              <h2 className="book-detail-title">{bookData.title}</h2>

              <div className='book-detail-content'>
                <div className="book-detail-meta">
                  <div className="meta-item">
                    <span className="label">ISBN:</span>
                    <span className="value">{bookData.ISSN}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">{language === 'zh' ? '语言' : 'Language'}:</span>
                    <span className="value">{bookData.lang}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">{language === 'zh' ? '作者' : 'Author'}:</span>
                    <span className="value">{bookData.author}</span>
                  </div>
                </div>

                <div className="download-section">
                  <Button 
                    type="primary" 
                    icon={<FilePdfOutlined />}
                    onClick={handleDownloadPDF}
                    size="large"
                    style={{ backgroundColor: '#006837', borderColor: '#006837' }}
                  >
                    {language === 'zh' ? 'PDF全篇下载' : 'Download PDF'}
                  </Button>
                </div>
              </div>
              
              
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="navigation-tabs navigation-tabs-detail">
        <div className="container">
          <div className="tabs">
            <button 
              className="tab-detail-btn active"
              onClick={() => scrollToSection('description')}
            >
              {language === 'zh' ? '图书简介' : 'Book Description'}
            </button>
            <button 
              className="tab-detail-btn"
              onClick={() => scrollToSection('contents')}
            >
              {language === 'zh' ? '目录' : 'Table of Contents'}
            </button>
            <button 
              className="tab-detail-btn"
              onClick={() => scrollToSection('authors')}
            >
              {language === 'zh' ? '作者信息' : 'Author Information'}
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-sections">
        <div className="container">
          {/* Book Description */}
          <div id="description" className="content-detail-section">
            <h3 className="section-detail-title">{language === 'zh' ? '图书简介' : 'Book Description'}</h3>
            <div className="section-content">
              {bookData.introduction}
            </div>
          </div>

          {/* Table of Contents */}
          <div id="contents" className="content-detail-section">
            <h3 className="section-detail-title">{language === 'zh' ? '目录' : 'Table of Contents'}</h3>
            <div className="section-content">
              <div dangerouslySetInnerHTML={{ __html: bookData.catalogue }}></div>
            </div>
          </div>

          {/* Author Information */}
          <div id="authors" className="content-detail-section">
            <h3 className="section-detail-title">{language === 'zh' ? '作者信息' : 'Author Information'}</h3>
            <div className="section-content">
            <div dangerouslySetInnerHTML={{ __html: bookData.author_info }}></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BookDetailPage
