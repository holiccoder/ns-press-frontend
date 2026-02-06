import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './CopyrightPage.less'

const CopyrightPage = () => {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    manuscriptTitle: '',
    authorName: '',
    submittedJournal: ''
  })

  const copyrightData = {
    zh: {
      title: '版权转让协议',
      subtitle: 'Copyright Transfer Agreement',
      form: {
        manuscriptTitle: '稿件标题:',
        authorName: '作者姓名:',
        submittedJournal: '提交期刊:'
      },
      introduction: '上述稿件的作者（版权持有人）同意在本刊（以下简称"本刊"）发表，并自愿将论文的版权在全球范围内转让给本刊编辑部/出版社。现将相关问题明确如下：',
      terms: [
        {
          title: '第一条',
          content: '稿件作者保证作品为原创，不涉及保密内容，避免一稿多投等学术不端行为。因侵权或泄密而产生的所有责任由作者承担。'
        },
        {
          title: '第二条',
          content: '全体作者同意将论文的复制权和传播权——包括但不限于复制权、发行权、信息网络传播权、广播权、表演权、翻译权、汇编权、改编权等著作权权利——转让给本刊。'
        },
        {
          title: '第三条',
          content: '作者对论文的署名权无争议。如有争议，由作者承担全部责任。'
        },
        {
          title: '第四条',
          content: '转让费用：本协议下的权利转让为无偿转让。'
        },
        {
          title: '第五条',
          content: '作者服务：为协助作者进行科研、学习、创作和发表，本刊及相关授权平台为作者提供一系列服务。相关服务在第三方平台公开披露。'
        },
        {
          title: '第六条',
          content: '因履行本协议发生的争议，双方协商解决。协商不成的，任何一方均可向本刊出版社所在地有管辖权的人民法院提起诉讼。'
        }
      ],
      signature: {
        title: '全体作者的签名:',
        table: {
          headers: ['序号', '作者签名', '作者身份证号', '作者机构', '签署日期'],
          rows: 3
        },
        note: '注意:如果作者超过3位,请手动添加签名列。'
      }
    },
    en: {
      title: 'Copyright Transfer Agreement',
      subtitle: '版权转让协议',
      form: {
        manuscriptTitle: 'Manuscript Title:',
        authorName: 'Author Name:',
        submittedJournal: 'Submitted Journal:'
      },
      introduction: 'The author (copyright holder) of the aforementioned manuscript agrees to its publication in this journal (referred to as "this journal" hereafter) and voluntarily transfers the copyright of the paper globally to the journal\'s editorial department/publisher. It then clarifies related issues as follows:',
      terms: [
        {
          title: 'Article 1',
          content: 'The manuscript author guarantees the work is original, does not involve confidentiality, and avoids academic misconduct such as multiple submissions of the same manuscript. All responsibility for infringement or disclosure lies with the author.'
        },
        {
          title: 'Article 2',
          content: 'All authors agree to transfer the reproduction and dissemination rights of the paper—including but not limited to reproduction rights, distribution rights, information network dissemination rights, broadcasting rights, performance rights, translation rights, compilation rights, adaptation rights, and other copyright rights—to the journal.'
        },
        {
          title: 'Article 3',
          content: 'Authors have no dispute over the authorship of the paper. Any disputes are the sole responsibility of the authors.'
        },
        {
          title: 'Article 4',
          content: 'Transfer Fee: The rights transfer under this agreement is free of charge.'
        },
        {
          title: 'Article 5',
          content: 'Author Services: To assist authors with research, study, creation, and publication, this journal and related authorized platforms provide a series of services to authors. Related services are subject to public disclosure on third-party platforms.'
        },
        {
          title: 'Article 6',
          content: 'Disputes arising from the performance of this agreement shall be resolved through negotiation. If negotiation fails, either party may file a lawsuit with the competent People\'s Court in the location of the journal\'s publisher.'
        }
      ],
      signature: {
        title: 'Signatures of All Authors:',
        table: {
          headers: ['Serial Number', 'Author Signature', 'Author ID Number', 'Author Institution', 'Signing Date'],
          rows: 3
        },
        note: 'Note: If there are more than 3 authors, please manually add signature rows.'
      }
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="copyright-page">
      <Header />
      
      {/* Banner Section */}
      <section className="copyright-banner">
        <div className="banner-content">
          <h1 className="copyright-banner-title">{copyrightData[language].title}</h1>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="copyright-content-section">
        <div className="container">
          <div className="copyright-content-wrapper">
            {/* Form Fields */}
            <div className="form-fields">
              <div className="form-field">
                <label>{copyrightData[language].form.manuscriptTitle}</label>
                <div className='form-input-box'></div>
              </div>
              
              <div className="form-field">
                <label>{copyrightData[language].form.authorName}</label>
                <div className='form-input-box'></div>
              </div>
              
              <div className="form-field">
                <label>{copyrightData[language].form.submittedJournal}</label>
                <div className='form-input-box'></div>
              </div>
            </div>

            {/* Agreement Terms */}
            <div className="agreement-terms">
              <div className="introduction">
                <p>{copyrightData[language].introduction}</p>
              </div>
              
              <div className="terms-list">
                {copyrightData[language].terms.map((term, index) => (
                  <div key={index} className="term-item">
                    <p className="term-content">{index + 1}、{term.content}</p>
                  </div>
                ))}
              </div>
            </div>  

            {/* Signature Section */}
            <div className="signature-section">
              <p className="signature-title">{copyrightData[language].signature.title}</p>
              
              <div className="signature-table">
                <table border={1} style={{ borderCollapse: 'collapse' }} bgcolor='#eee'>
                  <thead>
                    <tr>
                      {copyrightData[language].signature.table.headers.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: copyrightData[language].signature.table.rows }, (_, index) => (
                      <tr key={index}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className="signature-note">{copyrightData[language].signature.note}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CopyrightPage
