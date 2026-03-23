import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import './Footer.less'

const Footer = () => {
  const { language } = useLanguage()
  const footerContent = {
    zh: {
      phone: '电话: 00852-30697751',
      email: '邮件: routhpub@163.com',
      zipCode: '邮编: 999077',
      website: '网址: www.ns-press.com',
      address: '地址: 九龍尖沙咀科學館道14號 新文華中心B座7樓701室127單位',
      contentExploration: {
        title: '内容探索',
        items: ['首页', '期刊', '图书', '关于我们']
      },
      authorServices: {
        title: '作者服务',
        items: ['文章处理费', '开放获取政策', '版权转让协议', '作者贡献声明']
      },
      friendlyLinks: {
        title: '友情链接',
        items: [
          {
            name: 'ISSN',
            url: 'https://portal.issn.org'
          },{
            name: 'Google Scholar (谷歌学术)',
            url: 'https://scholar.google.com'
          }, {
            name: 'cnki中国知网',
            url: 'https://www.cnki.net'
          }, {
            name: '维普网',
            url: 'https://www.cqvip.com'
          }
        ]
      }
    },
    en: {
      phone: 'Phone: 00852-30697751',
      email: 'Email: routhpub@163.com',
      zipCode: 'Zip Code: 999077',
      website: 'Website: www.ns-press.com',
      address: 'Address: Unit 127, 7/F, Tower B, New World Centre, 14 Science Museum Road, Tsim Sha Tsui, Kowloon',
      contentExploration: {
        title: 'Content Exploration',
        items: ['Home', 'Journal', 'Book', 'About Us']
      },
      authorServices: {
        title: 'Author Services',
        items: ['Article Processing Charges', 'Open Access Policy', 'Copyright Transfer Agreement', 'Author Contribution Statement']
      },
      friendlyLinks: {
        title: 'Friendly Links',
        items: [{
          name: 'ISSN',
            url: 'https://portal.issn.org'
          }, {
            name: 'Google Scholar',
            url: 'https://scholar.google.com'
          }, {
            name: 'CNKI',
            url: 'https://www.cnki.net'
          }, {
            name: 'VIP',
            url: 'https://www.cqvip.com'
          }
        ]
      }
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <img className='footer-logo-img' src='https://api.ns-press.com/uploads/images/website/logo-white.png' />
              {/*<div className="logo-icon">NSP</div>*/}
              {/*<div className="logo-text">*/}
              {/*   {language === 'zh' ? '香港自然科学出版社' : 'Hong Kong Natural Science Press Limited'}*/}
              {/*</div>*/}
            </div>
            <div className="footer-contact-info">
              <p>{footerContent[language].phone}</p>
              <p>{footerContent[language].email}</p>
              <p>{footerContent[language].zipCode}</p>
              <p>{footerContent[language].website}</p>
              <p>{footerContent[language].address}</p>
            </div>
          </div>
          
          <div className="footer-right">
            <div className="footer-column">
              <h3>{footerContent[language].contentExploration.title}</h3>
              <ul>
                {footerContent[language].contentExploration.items.map((item, index) => {
                  let linkPath = '/'
                  if (item === '期刊' || item === 'Journal') {
                    linkPath = '/journals'
                  } else if (item === '图书' || item === 'Book') {
                    linkPath = '/books'
                  } else if (item === '关于我们' || item === 'About Us') {
                    linkPath = '/about'
                  }
                  return (
                    <li key={index}>
                      <Link to={linkPath}>{item}</Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>{footerContent[language].authorServices.title}</h3>
                      <ul>
          {footerContent[language].authorServices.items.map((item, index) => {
            let linkPath = '#'
            if (item === '文章处理费' || item === 'Article Processing Charges') {
              linkPath = '/apc'
            } else if (item === '版权转让协议' || item === 'Copyright Transfer Agreement') {
              linkPath = '/copyright'
            } else if (item === '作者贡献声明' || item === 'Author Contribution Statement') {
              linkPath = '/author-contribution'
            }
            return (
              <li key={index}>
                <Link to={linkPath}>{item}</Link>
              </li>
            )
          })}
        </ul>
            </div>
            
            <div className="footer-column">
              <h3>{footerContent[language].friendlyLinks.title}</h3>
              <ul>
                {footerContent[language].friendlyLinks.items.map((item, index) => (
                  <li key={index}><a target='black' href={item.url}>{item.name}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
