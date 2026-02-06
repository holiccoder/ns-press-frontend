import React from 'react'
import Header from '../components/Header'
import Banner from '../components/Banner'
import JournalSection from '../components/JournalSection'
import BookSection from '../components/BookSection'
import AboutSection from '../components/AboutSection'
import Footer from '../components/Footer'
import './HomePage.less'
import { journalAPI, bookAPI } from '../services/api'
import { useEffect, useState } from 'react'

const HomePage = () => {
  const [journalList, setJournalList] = useState([])
  const [bookList, setBookList] = useState([])

  useEffect(() => {
    const fetchJournals = async () => {
      const response = await journalAPI.getJournalList();
      setJournalList(response.data.lists);
    }
    fetchJournals()

    const fetchBooks = async () => {
      const response = await bookAPI.getBookList(1,8);
      setBookList(response.data.lists);
    }
    fetchBooks()

  }, [])
  return (
    <div className="home-page">
      <Header />
      <Banner />
      <JournalSection list={journalList} />
      <BookSection list={bookList} />
      <AboutSection />
      <Footer />
    </div>
  )
}

export default HomePage
