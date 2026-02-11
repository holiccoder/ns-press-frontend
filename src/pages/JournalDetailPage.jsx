import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Table, Select, Button, Input, Pagination } from 'antd'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './JournalDetailPage.less'
import { journalAPI } from '../services/api'

const { Search } = Input
const { Option } = Select

const JournalDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [activeSection, setActiveSection] = useState('digital')
  const [searchYear, setSearchYear] = useState(null)
  const [searchIssue, setSearchIssue] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [journalDetail, setJournalDetail] = useState({})
  const [years, setYears] = useState([]);
  const [issues, setIssues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (id) {
      journalAPI.getJournalDetail(id).then(res => {
        setJournalDetail(res.data);
        // setYears(res.data.year);
        console.log('res',res)
      })

    }
  }, [id])

  useEffect(() => {
    if (id) {
      journalAPI.getDigitalJournals(id, searchYear, searchIssue, currentPage, pageSize).then(res => {
        setSearchResults(res.data.lists);
        setTotal(res.data.count);
      }).catch(err => {
        console.error('获取数字期刊失败:', err);
        setSearchResults([]);
        setTotal(0);
      })
    }
  }, [id, searchYear, searchIssue, currentPage, pageSize])

  // 表格列定义
  const columns = [
    {
      title: language === 'zh' ? '文章标题' : 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text) => {
       return  <div style={{ color: '#006837' }}>{text}</div>
      }
    },
    {
      title: language === 'zh' ? '作者' : 'Authors',
      dataIndex: 'author',
      key: 'author',
      width: 150,
      render: (text) => {
        return <div style={{ color: '#919191' }}>{text}</div>
      }
    },
    {
      title: language === 'zh' ? '查看' : 'Check',
      dataIndex: 'download',
      key: 'download',
      width: 100,
      render: (text, record) => (
        <a 
          href={`/journal/${record.id}/article/${record.id}`} 
          style={{ color: '#919191' }}
          onClick={(e) => {
            e.preventDefault()
            window.location.href = `/journal/${record.id}/article/${record.id}`
          }}
        >
          点击查看
        </a>
      ),
    },
  ]

  // 搜索功能
  const handleSearch = () => {
    setCurrentPage(1);
  }

  const handleClearSearch = () => {
    setSearchYear(null);
    setSearchIssue(null);
    setIssues([]);
    setCurrentPage(1);
  }

  // 锚点滚动
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  const handleSelectYear = (value) => {
    console.log('选择年份:', value);
    setSearchIssue(null);
    setSearchYear(value);
    setIssues(journalDetail.periods[value]);
    setCurrentPage(1); // 重置页码
  }

  const handleSelectIssue = (value) => {
    console.log('选择期数:', value);
    setSearchIssue(value);
    setCurrentPage(1); // 重置页码
  }

  const sections = [
    { id: 'digital', zh: '数字期刊', en: 'Digital Journal' },
    { id: 'introduction', zh: '刊物介绍', en: 'Journal Introduction' },
    { id: 'scope', zh: '收稿范围', en: 'Scope' },
    { id: 'policy', zh: '期刊政策', en: 'Journal Policy' },
    { id: 'guidelines', zh: '作者须知', en: 'Author Guidelines' },
    { id: 'editorial', zh: '编委团队', en: 'Editorial Board' },
    { id: 'payment', zh: '文章处理费说明', en: 'Payment Information' },
  ]

  return (
    <div className="journal-detail-page">
      <Header />
      
      {/* Banner Section */}
      <section className="journal-detail-banner">
        <div className="qikan-detail-banner-content">
          <h1 className="banner-title">{journalDetail.title}</h1>
          <p className="banner-subtitle">{journalDetail.subtitle}</p>
        </div>
      </section>

      {/* Journal Introduction Section */}
      <section className="journal-intro-section">
        <div className="container">
          <div className="journal-intro">
            <div className="journal-cover">
              <img className="cover-placeholder" src={journalDetail.cover_image} />
            </div>
            <div className="journal-info">
              <h2 className="journal-title">{journalDetail.title}</h2>
              <div className='journal-detail-content'>
                <div className="journal-detail-meta">
                  <p><strong>{language === 'zh' ? 'ISSN' : 'ISSN'}:</strong> {journalDetail.issn}</p>
                  <p><strong>{language === 'zh' ? '出版频率' : 'Frequency'}:</strong> {journalDetail.frequency}</p>
                  <p><strong>{language === 'zh' ? '语言' : 'Language'}:</strong> {journalDetail.lang}</p>
                </div>
                <div>
                  <div className='journal-type-box' onClick={() => scrollToSection('digital')}>数字期刊</div>
                <div className='journal-type-box submit-essay' onClick={() => navigate('/login')}>在线投稿</div>
                </div>
                
              </div>
              <div className='journal-detail-description'>
                {journalDetail.description}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="section-nav">
        <div className="container">
          <div className="nav-tabs">
            {sections.map(section => (
              <button
                key={section.id}
                className={`nav-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                {section[language]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-sections">
        <div className="container">
          {/* Digital Journal Section */}
          <div id="digital" className="content-section-box">
            <div className="search-section">
              <div className="search-controls">
                <Select
                  value={searchYear}
                  onChange={handleSelectYear}
                  style={{ width: 180, marginRight: 16 }}
                  placeholder={language === 'zh' ? '请选择期刊年份' : 'Select Year'}
                >
                  {
                    years?.map((item, index) => (
                      <Option value={item} key={index}>{item}</Option>
                    ))
                  }
                </Select>
                <Select
                  value={searchIssue}
                  onChange={handleSelectIssue}
                  style={{ width: 180, marginRight: 16 }}
                  placeholder={language === 'zh' ? '请选择期刊期数' : 'Select Issue'}
                >
                  {
                    issues?.map((item, index) => (
                      <Option value={item} key={index}>{item}</Option>
                    ))
                  }
                </Select>
                <Button type="primary" onClick={handleSearch} style={{ backgroundColor: '#006837', borderColor: '#006837', marginRight: 8 }}>
                  {language === 'zh' ? '搜索' : 'Search'}
                </Button>
                <Button onClick={handleClearSearch}>
                  {language === 'zh' ? '清除' : 'Clear'}
                </Button>
              </div>
              <Table
                columns={columns}
                dataSource={searchResults}
                pagination={false}
                size="small"
                scroll={{ x: 1000 }}
              />
              <Pagination current={currentPage} pageSize={pageSize} total={total} onChange={handlePageChange} size="small" style={{ marginTop: 40, textAlign: 'center', display: 'flex', justifyContent: 'center' }} />
            </div>
          </div>

          {/* Journal Introduction Section */}
          <div id="introduction" className="content-section-box">
            <h3 className="detail-section-title">{language === 'zh' ? '刊物介绍' : 'Journal Introduction'}</h3>
            <div className="section-content">
              { journalDetail.introduction }
            </div>
          </div>

          {/* Scope Section */}
          <div id="scope" className="content-section-box">
            <h3 className="detail-section-title">{language === 'zh' ? '收稿范围' : 'Scope'}</h3>
            <div className="section-content">
              <ul>
                {
                  journalDetail?.scope?.split(',')?.map((item,index) => (
                    <li key={index}>{item}</li>
                  ))
                }
              </ul>
            </div>
          </div>

          {/* Policy Section */}
          <div id="policy" className="content-section-box">
            <h3 className="detail-section-title">{language === 'zh' ? '期刊政策' : 'Journal Policy'}</h3>
            <div className="section-content">
              <div dangerouslySetInnerHTML={{ __html: journalDetail.policy }}></div>
            </div>
          </div>

          {/* Guidelines Section */}
          <div id="guidelines" className="content-section-box">
            <h3 className="detail-section-title">{language === 'zh' ? '作者须知' : 'Author Guidelines'}</h3>
            <div className="section-content">
              <div dangerouslySetInnerHTML={{ __html: journalDetail.author_notice }}></div>
            </div>
          </div>

          {/* Editorial Board Section */}
          <div id="editorial" className="content-section-box">
            <h3 className="detail-section-title">{language === 'zh' ? '编委团队' : 'Editorial Board'}</h3>
            <div className="section-content">
              {
                journalDetail.team?.map((item, index) => (
                  <div className='detail-content-box' key={index}>
                    <h4>{item.job}</h4>
                    {
                      item.member?.map((member, _index) => (
                        <div className={`detail-box-item ${_index % 2 === 1 ? 'detail-box-item-first' : ''}`} key={_index}>
                          <div className='detail-box-item-name'>{member.name}</div>
                          <div className='detail-box-item-title'>{member.title}</div>
                          <div className='detail-box-item-region'>{member.region}</div>
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          </div>

          {/* Payment Information Section */}
          <div id="payment" className="content-section-box">
            <h3 className="detail-section-title">{language === 'zh' ? '文章处理费说明' : 'Payment Information'}</h3>
            <div className="section-content">
                 <p>{language === 'zh' ? '香港自然科学出版社倡导知识共享，采用开放获取的商业模式，我们也是布达佩斯开放获取先导计划(BudapestOpenAccess Initiative,BOAI)的拥护者。出版社所有期刊都是国际开放获取期刊，所发表的全部文章均可在期刊网站上免费阅读、下载、引用和传播。NSP出版社确保没有任何大学图书馆或个人需要通过支付费用来获得本刊文章的阅读权，因此NSP出版社没有任何收益来自于文章的出版发行。' : 'Hong Kong Natural Science Publisher advocates knowledge sharing and adopts an open access business model. We are also supporters of the Budapest Open Access Initiative (BOAI). All journals of the publisher are international open access journals, and all published articles can be freely read, downloaded, cited and disseminated on the journal website. NSP Publisher ensures that no university library or individual needs to pay fees to obtain the right to read articles in this journal, so FSP Publisher has no revenue from the publication of articles.'}</p>

                 <p>{language === 'zh' ? '本刊文章处理费用由作者或者所在单位，或者研究基金承担，或者社会团体赞助。' : 'The article processing fee is borne by the author, the author\'s institution, research grants, or social organizations.'}</p>

                 <p>{language === 'zh' ? '文章处理费:1800港币每版。' : 'Article processing fee: HK$1800 per article.'}</p>

                 <p>{language === 'zh' ? '对于编委评价优秀的文章和收入困难者，出版社可以根据评估做出优惠措施。来保证优秀文章的出版。在读学生提供证明后，按六折收费。' : 'For articles evaluated by editorial board members as excellent and for authors with financial difficulties, the publisher may make preferential arrangements to ensure the publication of excellent articles. Students currently enrolled will be charged at 60% of the standard fee upon providing proof.'}</p>
                 <p>{language === 'zh' ? '支付方式:稿件在录用后通过以下付款链接支付' : 'Payment method: Payment is required after manuscript acceptance via the following payment link.'}</p>

                 <p><a href="https://www.front-sci.com/journal/mef?issue=v8i17">{language === 'zh' ? '港币付款链接' : 'HKD Payment Link'}</a></p>


            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default JournalDetailPage
