import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import './JournalSection.less'


const JournalSection = (props) => {
  const { list } = props;
  const { language } = useLanguage()
  const navigate = useNavigate()

  const sectionTitle = {
    zh: { title: '期刊',  title2: '出版', subtitle: 'JOURNAL PUBLISHING' },
    en: { title: 'Journal', title2: 'Publishing', subtitle: '期刊出版' }
  }

   const handleJournalClick = (journalId) => {
    navigate(`/journal/${journalId}`)
  }

  return (
    <section className="journal-section">
      <div className="container">
        <div className="section-header">
          <div className='section-header-title'>
            <h2 className="journal-section-title1">
              {sectionTitle[language].title}
            </h2>
            {
              language === 'en' && (  
                <p>&nbsp;&nbsp;</p>
              )
            }
            <h2 className="journal-section-title">
              {sectionTitle[language].title2}
            </h2>
          </div>
          
          <p className="section-subtitle">{sectionTitle[language].subtitle}</p>
        </div>
        
        <div className="journal-grid">
          {list.map((journal, index) => (
            <div key={index} className="home-journal-card"  onClick={() => handleJournalClick(journal.id)}>
              <div className="journal-image">
                <img className="journal-placeholder" src={journal.cover_image} alt={journal.title} />
              </div>
              <div className="journal-info">
                <h3 className="home-journal-title">{journal.title}</h3>
                <div className="journal-details">
                  <p><span className='journal-issn'>ISSN:</span> {journal.issn?.split(',')?.[0] || ''}</p>
                  <p><span className='journal-issn'></span> {journal.issn?.split(',')?.[1] || ''}</p>
                  <p>{language === 'zh' ? '出版频率' : 'Publication Frequency'}: {journal.frequency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default JournalSection
