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
    { id: 'editorial', zh: '编委团队', en: 'Editorial Board' }
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
                <div className='journal-type-box' onClick={() => scrollToSection('digital')}>数字期刊</div>
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
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default JournalDetailPage
