import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './APCPage.less'

const APCPage = () => {
  const { language } = useLanguage()

  const apcData = {
    zh: {
      title: '文章处理费',
      subtitle: 'Article Processing Charge',
      description: '香港自然科学出版社 (NSP) 出版的相关期刊遵循国际开放获取出版(OA)原则, 收取文章处理费 (APC) 约为在1800港币。',
      details: [
        {
          title: '收费标准',
          content: '我们的文章处理费标准透明公开，根据文章类型和篇幅确定具体费用。'
        },
        {
          title: '减免政策',
          content: '对来自低收入国家的作者，我们提供费用减免政策，支持全球学术发展。'
        },
        {
          title: '支付方式',
          content: '支持多种在线支付方式，包括信用卡、银行转账等，确保支付便捷安全。'
        },
        {
          title: '发票开具',
          content: '提供正式发票和收据，满足作者和机构的财务报销需求。'
        }
      ]
    },
    en: {
      title: 'Article Processing Charge',
      subtitle: '文章处理费',
      description: 'Journals published by Hong Kong Natural Science Press (NSP) follow the international Open Access Publishing (OA) principle, and the Article Processing Charge (APC) is approximately 1800 Hong Kong Dollars.',
      details: [
        {
          title: 'Fee Standards',
          content: 'Our article processing fee standards are transparent and public, with specific fees determined by article type and length.'
        },
        {
          title: 'Waiver Policy',
          content: 'For authors from low-income countries, we provide fee waiver policies to support global academic development.'
        },
        {
          title: 'Payment Methods',
          content: 'Support various online payment methods including credit cards, bank transfers, etc., ensuring convenient and secure payment.'
        },
        {
          title: 'Invoice Issuance',
          content: 'Provide formal invoices and receipts to meet the financial reimbursement needs of authors and institutions.'
        }
      ]
    }
  }

  return (
    <div className="apc-page">
      <Header />
      
      {/* Main Content Section */}
      <section className="apc-content-section">
        <div className="container">
          <div className="content-wrapper">
            <div className="apc-header">
              <h1 className="apc-title">{apcData[language].title}</h1>
              <p className="apc-subtitle">{apcData[language].subtitle}</p>
            </div>
            
            <div className="apc-description">
              <p>{apcData[language].description}</p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default APCPage
