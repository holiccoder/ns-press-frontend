import React, { createContext, useContext, useState, useEffect } from 'react'
import { getLanguage, setLanguage } from '../services/api'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  // 从localStorage获取语言设置，如果没有则默认为中文
  const [language, setLanguageState] = useState(() => {
    const savedLanguage = localStorage.getItem('language')
    return savedLanguage || 'zh'
  })

  // 监听localStorage变化
  useEffect(() => {
    const handleStorageChange = () => {
      const savedLanguage = localStorage.getItem('language')
      if (savedLanguage && savedLanguage !== language) {
        setLanguageState(savedLanguage)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [language])

  // 切换语言（会刷新当前页面）
  const changeLanguage = (newLanguage) => {
    localStorage.setItem('language', newLanguage)
    window.location.href = '/'
    setLanguage(newLanguage) // 这会保存到localStorage并刷新当前页面
  }

  // 设置语言（不刷新页面，仅更新状态）
  const setLanguage = (newLanguage) => {
    setLanguageState(newLanguage)
  }

  const value = {
    language,
    changeLanguage,
    setLanguage
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
