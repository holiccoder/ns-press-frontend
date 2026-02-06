import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './Banner.less'

const Banner = () => {
  const { language } = useLanguage()
  const bannerText = {
    zh: {
      title: '聚焦海内外知识共享, 推动国际学术发展',
      subtitle: 'Focus on knowledge sharing at home and abroad to promote international academic development'
    },
    en: {
      title: 'Focus on knowledge sharing at home and abroad to promote international academic development',
      subtitle: '聚焦海内外知识共享, 推动国际学术发展'
    }
  }

  return (
    <section className="banner">
      <div className="home-banner-content">
        <h1 className="banner-title">{bannerText[language].title}</h1>
        <p className="banner-subtitle">{bannerText[language].subtitle}</p>
      </div>
    </section>
  )
}

export default Banner
