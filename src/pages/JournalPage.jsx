import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { journalAPI } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './JournalPage.less'

const JournalPage = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [journals, setJournals] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const journalsPerPage = 12 // 每页显示12个期刊（3行4列）

 
  // 获取期刊数据的示例（实际项目中会使用）
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true)
        // 实际API调用示例：
        const response = await journalAPI.getJournalList(currentPage, journalsPerPage)
        setJournals(response.data.lists)
        // 计算总页数
        const total = Math.ceil(response.data.count / journalsPerPage)
        setTotalPages(total)
      } catch (error) {
        console.error('Failed to fetch journals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJournals()
  }, [currentPage, language])


  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleJournalClick = (journalId) => {
    navigate(`/journal/${journalId}`)
  }

  return (
    <div className="journal-page">
      <Header />
      
      {/* Banner Section */}
      <section className="journal-banner qi-journal-banner">
        <div className="qi-banner-content">
          <h1 className="banner-title">
            {language === 'zh' ? '期刊出版' : 'Journal Publishing'}
          </h1>
          <p className="banner-subtitle">
            {language === 'zh' ? 'JOURNAL PUBLISHING' : '期刊出版'}
          </p>
        </div>
      </section>

      {/* Journal List Section */}
      <section className="journal-list-section">
        <div className="container">
          <div className="journal-grid">
            {journals.map((journal, index) => (
              <div 
                key={index} 
                className="journal-card"
                onClick={() => handleJournalClick(journal.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="journal-image">
                  <img className="journal-placeholder" src={journal.cover_image} alt={journal.title} />
                </div>
                <div className="journal-info">
                  <h3 className="journal-title">{journal.title}</h3>
                  <div className="journal-details">
                    <p><span className='journal-issn'>ISSN:</span> {journal.issn?.split(',')?.[0] || ''}</p>
                    <p><span className='journal-issn'></span> {journal.issn?.split(',')?.[1] || ''}</p>
                    <p>{language === 'zh' ? '出版频率' : 'Publication Frequency'}: {journal.frequency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button 
              className="pagination-btn prev"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {language === 'zh' ? '上一页' : 'Previous'}
            </button>
            
            <div className="page-info">
              {currentPage} / {totalPages}
            </div>
            
            <button 
              className="pagination-btn next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {language === 'zh' ? '下一页' : 'Next'}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default JournalPage
