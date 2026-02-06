import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import './BookSection.less'

const BookSection = (props) => {
  const { list } = props;
  const { language } = useLanguage()
  const [selectedBook, setSelectedBook] = useState(0)
  const navigate = useNavigate()

  const sectionTitle = {
    zh: { title: '图书', title2: '出版', subtitle: 'BOOK PUBLISHING' },
    en: { title: 'Book ', title2: 'Publishing', subtitle: '图书出版' }
  }

  const handleIndicatorClick = (index) => {
    setSelectedBook(index)
  }

  const handleGoBook = (id) => {
    navigate(`/book/${id}`)
  }

  return (
    <section className="book-section">
      <div className="container">
        <div className="section-header">
          <div className='book-setion-header-title'>
            <h2 className="section-title1">{sectionTitle[language].title}</h2>
            {
              language === 'en' && (  
                <p>&nbsp;&nbsp;</p>
              )
            }
            <h2 className="section-title">{sectionTitle[language].title2}</h2>
          </div>
          <p className="section-subtitle">{sectionTitle[language].subtitle}</p>
        </div>
        
        <div className="book-carousel">
          <div className="book-grid" key={selectedBook}>
            {list.slice(selectedBook * 2, selectedBook * 2 + 2).map((book, index) => (
              <div key={index} className="book-card" onClick={() => handleGoBook(book.id)}>
                <div className="book-image2">
                  <img src={book.cover_image} alt={book.title} className="book-placeholder2" />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-language">
                    {language === 'zh' ? '语言' : 'Language'}: {book.lang}
                  </p>
                  <p className="book-isbn">ISBN: {book.ISSN}</p>
                  <p className="book-description2">图书介绍: {book.introduction}</p>
                  <button className="view-more-btn">
                    {language === 'zh' ? '查看更多' : 'View More'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="book-indicators">
          {Array.from({ length: Math.ceil(list.length / 2) }, (_, index) => (
            <div
              key={index}
              className={`indicator indicator2 ${index === selectedBook ? 'active' : ''}`}
              onClick={() => handleIndicatorClick(index)}
            ></div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BookSection
