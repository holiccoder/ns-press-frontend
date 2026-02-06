import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './AuthorContributionPage.less'

const AuthorContributionPage = () => {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    manuscriptTitle: '',
    authorName: '',
    submittedJournal: '',
    contributions: ['', '', '']
  })

  const contributionData = {
    zh: {
      title: '作者贡献声明',
      subtitle: 'Author Contribution Statement',
      form: {
        manuscriptTitle: '稿件标题:',
        authorName: '作者姓名:',
        submittedJournal: '提交期刊:'
      },
      guidelines: '投稿前应征得所有作者的讨论并同意作者顺序，之后不得随意更改。当需要更改时，应出示所有作者和作者所在机构声明不反对的证明。通讯作者应由所有作者选出，并明确标明其姓名、单位、邮政编码和电子邮件地址。',
      obligations: {
        title: '作者应履行以下义务:',
        items: [
          '参与论文选题设计，或资料收集、分析、讨论；',
          '起草稿件，修改论文中的关键理论或其他主要内容；',
          '能根据编辑部反馈进行修改，回答学术问题并授权论文发表；',
          '除了研究贡献外，还对研究的学术诚信负责。'
        ]
      },
      clarification: '提供资金、贡献数据或管理项目不构成作者身份的条件。',
      confirmation: '在确认稿件作者身份后，作者应按顺序签上姓名，并分别明确说明自己的贡献。独立作者无需披露其贡献。',
      contributionTitle: '每个作者的贡献声明按顺序排列:',
      note: '注意:如果作者超过3位,请手动添加签名列。'
    },
    en: {
      title: 'Author Contribution Statement',
      subtitle: '作者贡献声明',
      form: {
        manuscriptTitle: 'Manuscript Title:',
        authorName: 'Author Name:',
        submittedJournal: 'Submission Journal:'
      },
      guidelines: 'Before submission, all authors must discuss and agree on the author order, which cannot be changed arbitrarily thereafter. If changes are needed, a statement of no objection from all authors and their respective institutions must be provided. The corresponding author should be selected by all authors and their name, affiliation, postal code, and email address clearly indicated.',
      obligations: {
        title: 'Authors should fulfill the following obligations:',
        items: [
          'Participate in the design of the paper\'s topic, or in data collection, analysis, and discussion;',
          'Draft the manuscript, revise key theories or other main content in the paper;',
          'Be able to revise based on editorial feedback, answer academic questions, and authorize publication of the paper;',
          'In addition to research contributions, also be responsible for the academic integrity of the research.'
        ]
      },
      clarification: 'Providing funding, contributing data, or managing projects does not constitute a condition for authorship.',
      confirmation: 'After confirming the manuscript author\'s identity, authors should sign their names in order and clearly state their respective contributions. Independent authors do not need to disclose their contributions.',
      contributionTitle: 'Each author\'s contribution statement is arranged in order:',
      note: 'Note: If there are more than 3 authors, please manually add signature rows.'
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContributionChange = (index, value) => {
    const newContributions = [...formData.contributions]
    newContributions[index] = value
    setFormData(prev => ({
      ...prev,
      contributions: newContributions
    }))
  }

  return (
    <div className="author-contribution-page">
      <Header />
      
      {/* Banner Section */}
      <section className="author-contribution-banner">
        <div className="banner-content">
          <h1 className="author-contribution-banner-title">{contributionData[language].title}</h1>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="author-contribution-content-section">
        <div className="container">
          <div className="author-contribution-content-wrapper">
            {/* Form Fields */}
            <div className="form-fields">
              <div className="form-field">
                <label>{contributionData[language].form.manuscriptTitle}</label>
                <div className='form-input-box'></div>
              </div>
              
              <div className="form-field">
                <label>{contributionData[language].form.authorName}</label>
                <div className='form-input-box'></div>
              </div>
              
              <div className="form-field">
                <label>{contributionData[language].form.submittedJournal}</label>
                <div className='form-input-box'></div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="guidelines-section">
              <div className="guidelines">
                <p>{contributionData[language].guidelines}</p>
              </div>
            </div>

            {/* Obligations */}
            <div className="obligations-section">
              <h3 className="obligations-title">{contributionData[language].obligations.title}</h3>
              <div className="obligations-list">
                {contributionData[language].obligations.items.map((item, index) => (
                  <div key={index} className="obligation-item">
                    <p className="obligation-content">{index + 1}、{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clarification */}
            <div className="clarification-section">
              <p className="clarification-text">{contributionData[language].clarification}</p>
            </div>

            {/* Confirmation */}
            <div className="confirmation-section">
              <p className="confirmation-text">{contributionData[language].confirmation}</p>
            </div>

            {/* Contribution Statements */}
            <div className="contribution-section">
              <h3 className="contribution-title">{contributionData[language].contributionTitle}</h3>
              <div className="contribution-list">
                {formData.contributions.map((contribution, index) => (
                  <div key={index} className="contribution-item">
                    <span>{index + 1}.</span>
                    <div className='contribution-input-box'></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AuthorContributionPage
