import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './AboutPage.less'

const AboutPage = () => {
  const { language } = useLanguage()

  const aboutData = {
    zh: {
      title: '关于我们',
      subtitle: 'About Us',
      companyName: '香港自然科学出版社',
      companyNameEn: 'Hong Kong Natural Science Press Limited',
      description: `香港自然科学出版社（简称NSP）成立于2025年，总部位于中国香港。我们专注于学术出版领域，采用开放获取（OA）模式，致力于为全球科研工作者提供高质量的学术出版服务。

我们充分利用香港的国际优势，积极推动本土研究成果走向世界，同时主动引进海外前沿学术资源，构建覆盖生命科学、地球科学、工程技术等领域的出版体系。

通过数字化技术和多语言渠道，我们打破地域壁垒，促进知识流动，以专业严谨的态度推动全球科研社区的深度连接，为国际学术发展注入持续动力。`,
      contactTitle: '如果您有任何需求，请联系我们！',
      contactInfo: {
        phone: '00852-30697751',
        email: 'routhpub@163.com',
        address: '九龍尖沙咀科學館道14號 新文華中心B座7樓701室127單位',
        postalCode: '999077',
        website: 'www.ns-press.com'
      }
    },
    en: {
      title: 'About Us',
      subtitle: '关于我们',
      companyName: 'Hong Kong Natural Science Press Limited',
      companyNameEn: '香港自然科学出版社',
      description: `Hong Kong Natural Science Press Limited (abbreviated as NSP) was established in 2025, headquartered in Hong Kong, China. We specialize in academic publishing, adopting the Open Access (OA) model, and are committed to providing high-quality academic publishing services for global researchers.

We fully leverage Hong Kong's international advantages to actively promote local research achievements to the world, while proactively introducing cutting-edge academic resources from overseas, building a publishing system covering life sciences, earth sciences, engineering technology, and other fields.

Through digital technology and multilingual channels, we break down geographical barriers, promote knowledge flow, and with a professional and rigorous attitude, promote deep connections within the global research community, injecting continuous momentum into international academic development.`,
      contactTitle: 'If you have any needs, please contact us!',
      contactInfo: {
        phone: '00852-30697751',
        email: 'routhpub@163.com',
        address: 'Unit 127, 7th Floor, Block B, New Mandarin Plaza, 14 Science Museum Road, Tsim Sha Tsui, Kowloon',
        postalCode: '999077',
        website: 'www.ns-press.com'
      }
    }
  }

  return (
    <div className="about-page">
      <Header />
      
      {/* Banner Section */}
      <section className="about-banner">
        <div className="about-banner-content">
          <h1 className="banner-title">{aboutData[language].title}</h1>
          <p className="about-banner-subtitle">{aboutData[language].subtitle}</p>
        </div>
      </section>

      {/* About Us Content Section */}
      <section className="about-content-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="company-name">{aboutData[language].companyName}</h2>
              {/* <p className="company-name-en">{aboutData[language].companyNameEn}</p> */}
              <div className="about-description-text">
                {aboutData[language].description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <img className="image-content" src='https://api.ns-press.com/uploads/images/website/guanyuwomen.jpg' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section">
        <div className="container">
          <h2 className="contact-title">{aboutData[language].contactTitle}</h2>
          <div className="contact-info">
            <div className="contact-item">
              <img className="contact-icon" src='/icons/phone.svg' alt="phone" />
              <div className="contact-details">
                <span className="contact-label">{language === 'zh' ? '电话' : 'Phone'}:</span>
                <span className="contact-value">{aboutData[language].contactInfo.phone}</span>
              </div>
            </div>
            
            <div className="contact-item">
               <img className="contact-icon" src='/icons/email.svg' alt="email" />
              <div className="contact-details">
                <span className="contact-label">{language === 'zh' ? '邮件' : 'Email'}:</span>
                <span className="contact-value">{aboutData[language].contactInfo.email}</span>
              </div>
            </div>
            
            <div className="contact-item">
              <img className="contact-icon" src='/icons/address.svg' alt="address" />
              <div className="contact-details">
                <span className="contact-label">{language === 'zh' ? '地址' : 'Address'}:</span>
                <span className="contact-value">{aboutData[language].contactInfo.address}</span>
              </div>
            </div>
            
            <div className="contact-item">
              <img className="contact-icon" src='/icons/postal.svg' alt="postal" />
              <div className="contact-details">
                <span className="contact-label">{language === 'zh' ? '邮编' : 'Postal Code'}:</span>
                <span className="contact-value">{aboutData[language].contactInfo.postalCode}</span>
              </div>
            </div>
            
            <div className="contact-item">
              <img className="contact-icon" src='/icons/website.svg' alt="website" />
              <div className="contact-details">
                <span className="contact-label">{language === 'zh' ? '网址' : 'Website'}:</span>
                <span className="contact-value">{aboutData[language].contactInfo.website}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutPage
