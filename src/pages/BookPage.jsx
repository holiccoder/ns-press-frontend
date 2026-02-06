import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { bookAPI } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './BookPage.less'

const BookPage = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [books, setBooks] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const booksPerPage = 6 // 每页显示6本书（3行2列）

  useEffect(() => {
    getBookList();
  }, [])

  const getBookList = async (page) => {
    const res = await bookAPI.getBookList(page, 6)
    console.log('res',res)
    setBooks(res.data.lists);
     // 计算总页数
    const total = Math.ceil(res.data.count / booksPerPage)
    setTotalPages(total);
  }


  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    getBookList(page);
  }

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`)
  }

  return (
    <div className="book-page">
      <Header />
      
      {/* Banner Section */}
      <section className="book-section-banner">
        <div className="banner-section-content">
          <h1 className="banner-title">
            {language === 'zh' ? '图书出版' : 'Book Publishing'}
          </h1>
          <p className="banner-subtitle">
            {language === 'zh' ? 'BOOK PUBLISHING' : '图书出版'}
          </p>
        </div>
      </section>

      {/* Book List Section */}
      <section className="book-list-section">
        <div className="container">
          <div className="book-grid">
            {books.map((book, index) => (
              <div 
                key={index} 
                className="book-card"
                onClick={() => handleBookClick(book.id)}
              >
                <div className="book-image">
                  <img className="book-img-placeholder" src={book.cover_image} alt={book.title} />
                </div>
                <div className="book-info">
                  <h3 className="book-titles">{book.title}</h3>
                  <p className="book-language">
                    {language === 'zh' ? '语言' : 'Language'}: {book.lang}
                  </p>
                  <p className="book-isbn">ISBN: {book.isbn}</p>
                  <p className="book-description2">图书介绍: {book.introduction}</p>
                  <button className="view-more-btn">
                    {language === 'zh' ? '查看更多' : 'View More'}
                  </button>
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

export default BookPage
