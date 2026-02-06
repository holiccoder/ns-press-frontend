import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from 'antd'
import { FilePdfOutlined } from '@ant-design/icons'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './DigitalJournalDetailPage.less'
import { journalAPI } from '../services/api'

const DigitalJournalDetailPage = () => {
  const { id, articleId } = useParams()
  const { language } = useLanguage()

  const [articleData, setArticleData] = useState({})

  useEffect(() => {
    if (id) {
      journalAPI.getDigitalJournalArticle(id).then(res => {
        setArticleData(res.data)
      })
    }
  }, [id])

  const handleDownloadPDF = () => {
    // 创建一个隐藏的<a>元素用于触发下载
    const link = document.createElement ('a')
    link.href = articleData.content
    // 添加downLoad属性强制下载而不是在浏览器中打开
    link.download =''// 空值表示使用服务器提供的文件名
    link.target ='_blank'
    link.style.display = 'none'
    // 添加到DOM中并触发点击事件
    document.body.appendChild(link)
    link. click();
    // 清理DOM
    document.body.removeChild(link)
  }

  return (
    <div className="digital-journal-detail-page">
      <Header />
      
      <section className="digital-article-banner">
        <div className="banner-content">
          <h1 className="banner-title">{articleData.title}</h1>
        </div>
      </section>

      <section className="article-detail-section">
        <div className="container">
          

          <div className="article-content">
            <div className="article-title">
              <h1>{articleData.title}</h1>
            </div>

            <div className="authors-section">
              <div className="author-info">
                <div className="author-name">{articleData.author}</div>
                <div className="author-affiliation">{articleData.address}</div>
              </div>
            </div>

            <div className="abstract-section">
              <h3>{language === 'zh' ? '摘要' : 'Abstract'}</h3>
              <p>{articleData.abstract}</p>
            </div>

            <div className="keywords-section">
              <h3>{language === 'zh' ? '关键词' : 'Keywords'}</h3>
              <div className="keywords-list">
                {articleData.keywords}
              </div>
            </div>

            <div className="references-section">
              <h3>{language === 'zh' ? '参考文献' : 'References'}</h3>
              <ol className="references-list">
                {articleData.references?.map((reference, index) => (
                  <li key={index} className="reference-item">
                    {reference}
                  </li>
                ))}
              </ol>
            </div>

            <div className="download-section">
              <h3>{language === 'zh' ? '全文' : 'FullText'}</h3>
              <Button 
                type="primary" 
                icon={<FilePdfOutlined />}
                onClick={handleDownloadPDF}
                size="large"
                style={{ backgroundColor: '#006837', borderColor: '#006837' }}
              >
                {language === 'zh' ? '下载PDF' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default DigitalJournalDetailPage
