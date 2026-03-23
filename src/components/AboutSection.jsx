import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './AboutSection.less'
import { useNavigate } from 'react-router-dom'


const AboutSection = () => {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const aboutContent = {
    zh: {
      title: '关于我们',
      subtitle: 'ABOUT US',
      description: `香港自然科学出版社成立于2025年，是一家专注于开放获取（OA）学术出版的国际化出版社。我们致力于推动学术知识的传播与共享，为全球学者提供高质量的学术出版服务。

我们的出版领域涵盖生命科学、地球科学、工程技术、人文社会科学等多个学科领域。通过严格的同行评议制度和专业的编辑团队，我们确保每篇发表的文章都具有较高的学术价值和创新性。

我们与全球多家知名学术机构和数据库建立了合作关系，致力于提升中国学术成果的国际影响力，促进国际学术交流与合作。`,
      buttonText: '查看更多'
    },
    en: {
      title: 'About Us',
      subtitle: '关于我们',
      description: `Hong Kong Natural Science Press Limited was established in 2025 as an international publisher specializing in Open Access (OA) academic publishing. We are committed to promoting the dissemination and sharing of academic knowledge, providing high-quality academic publishing services for scholars worldwide.

Our publishing areas cover multiple disciplines including life sciences, earth sciences, engineering technology, humanities and social sciences. Through strict peer review systems and professional editorial teams, we ensure that every published article has high academic value and innovation.

We have established cooperative relationships with many renowned academic institutions and databases worldwide, committed to enhancing the international influence of Chinese academic achievements and promoting international academic exchanges and cooperation.`,
      buttonText: 'View More'
    }
  }


  const sectionTitle = {
    zh: { title: '关于', title2: '我们', subtitle: 'About Us' },
    en: { title: 'About ', title2: 'Us', subtitle: '关于我们' }
  }

  return (
    <section className="about-section">
      <div className="container">
        <div className="section-header">
          <div className='about-header-title'>
            <h2 className="section-title1">{sectionTitle[language].title}</h2>
            {
              language === 'en' && (  
                <p>&nbsp;&nbsp;</p>
              )
            }
            <h2 className="section-title2">{sectionTitle[language].title2}</h2>
          </div>  
          <p className="section-subtitle">{sectionTitle[language].subtitle}</p>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <p className="about-description">{aboutContent[language].description}</p>
            <button onClick={() => navigate('/about')} className="view-more-btn">{aboutContent[language].buttonText}</button>
          </div>
          <div className="about-image">
            <img className="image-placeholder" src='https://api.ns-press.com/uploads/images/website/guanyuwomen.jpg' />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
