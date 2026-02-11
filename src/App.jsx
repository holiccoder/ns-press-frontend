import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { getAntdConfig } from './config/antdConfig'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import JournalPage from './pages/JournalPage'
import JournalDetailPage from './pages/JournalDetailPage'
import DigitalJournalDetailPage from './pages/DigitalJournalDetailPage'
import BookPage from './pages/BookPage'
import BookDetailPage from './pages/BookDetailPage'
import AboutPage from './pages/AboutPage'
import SubmissionPage from './pages/SubmissionPage'
import GuidePage from './pages/GuidePage'
import APCPage from './pages/APCPage'
import CopyrightPage from './pages/CopyrightPage'
import AuthorContributionPage from './pages/AuthorContributionPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import NewSubmissionPage from './pages/NewSubmissionPage'
import AccountInfoPage from './pages/AccountInfoPage'
import JoinEditorInChiefGroupPage from './pages/JoinEditorInChiefGroupPage'
import './styles/App.less'

// 内部组件，用于获取语言配置
const AppContent = () => {
  const { language } = useLanguage()
  const antdConfig = getAntdConfig(language)

  return (
    <ConfigProvider {...antdConfig}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/journals" element={<JournalPage />} />
            <Route path="/journal/:id" element={<JournalDetailPage />} />
            <Route path="/journal/:id/article/:articleId" element={<DigitalJournalDetailPage />} />
            <Route path="/books" element={<BookPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/submission" element={<SubmissionPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/apc" element={<APCPage />} />
            <Route path="/copyright" element={<CopyrightPage />} />
            <Route path="/author-contribution" element={<AuthorContributionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
            <Route path="/dashboard/new-submission" element={<ProtectedRoute element={<NewSubmissionPage />} />} />
            <Route path="/dashboard/account-info" element={<ProtectedRoute element={<AccountInfoPage />} />} />
            <Route path="/dashboard/join-editor-in-chief" element={<ProtectedRoute element={<JoinEditorInChiefGroupPage />} />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
