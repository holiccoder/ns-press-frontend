import { useEffect, useMemo, useState } from 'react'

import { DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Upload, message } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { authAPI, submissionAPI } from '../services/api'
import { dashboardNavItems as navItems } from '../constants/dashboardNavItems'
import { dashboardPanelTranslations as panels } from '../constants/dashboardPanelTranslations'
import './DashboardPage.less'

const isValidIdentifier = (value) => value !== undefined && value !== null && value !== ''

const extractListFromResponse = (response) => {
  if (Array.isArray(response)) return response

  const listCandidates = [
    response?.data?.list,
    response?.data?.rows,
    response?.data?.lists,
    response?.data?.records,
    response?.data,
    response?.list,
    response?.rows,
    response?.records
  ]

  return listCandidates.find(Array.isArray) || []
}

const getValue = (item, keys, fallback = '--') => {
  for (const key of keys) {
    const value = item?.[key]
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }
  return fallback
}

const getDateTimestamp = (value) => {
  if (value === undefined || value === null || value === '') return null

  const normalizeNumericTimestamp = (raw) => {
    const num = Number(raw)
    if (Number.isNaN(num)) return null
    if (num > 0 && num < 1e12) return num * 1000
    return num
  }

  if (value instanceof Date) {
    const timestamp = value.getTime()
    return Number.isNaN(timestamp) ? null : timestamp
  }

  if (typeof value === 'number') {
    const normalized = normalizeNumericTimestamp(value)
    if (normalized === null) return null
    const timestamp = new Date(normalized).getTime()
    return Number.isNaN(timestamp) ? null : timestamp
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null

    const normalized = normalizeNumericTimestamp(trimmed)
    if (normalized !== null) {
      const timestamp = new Date(normalized).getTime()
      return Number.isNaN(timestamp) ? null : timestamp
    }

    const parsed = Date.parse(trimmed)
    return Number.isNaN(parsed) ? null : parsed
  }

  return null
}

const getSubmissionId = (item) => getValue(item, ['id', 'contribution_id', 'contribute_id', 'paper_id', 'paperId'], null)

const getHistoryContributionId = (item) =>
  getValue(item, ['contribution_id', 'contributionId', 'contribute_id', 'paper_id', 'paperId', 'article_id', 'journal_contribution_id'], null)

const getHistoryUserId = (item) => getValue(item, ['user_id', 'uid', 'userId'], null)

const getHistoryDateValue = (item) =>
  getValue(item, ['update_time', 'updated_at', 'update_date', 'create_time', 'created_at', 'add_time'], null)

const getHistoryFilePath = (item) =>
  getValue(item, ['file', 'file_path', 'path', 'uri', 'url', 'updated_file', 'update_file', 'paper_file', 'attachment'], null)

const getHistoryNote = (item, fallback = '--') => getValue(item, ['note', 'remark', 'remarks', 'memo'], fallback)

const pickLatestHistoryRecord = (records = []) => {
  if (!Array.isArray(records) || records.length === 0) return null

  return records.reduce((latestRecord, record) => {
    if (!record || typeof record !== 'object') return latestRecord
    if (!latestRecord) return record

    const recordTimestamp = getDateTimestamp(getHistoryDateValue(record)) ?? -Infinity
    const latestTimestamp = getDateTimestamp(getHistoryDateValue(latestRecord)) ?? -Infinity

    return recordTimestamp >= latestTimestamp ? record : latestRecord
  }, null)
}

const getEmbeddedHistoryRecords = (item) => {
  const historyKeys = [
    'latest_history',
    'latestHistory',
    'history',
    'histories',
    'contribution_history',
    'contributionHistory',
    'pu_contribution_history'
  ]

  for (const key of historyKeys) {
    const value = item?.[key]
    if (Array.isArray(value)) return value
    if (value && typeof value === 'object') return [value]
  }

  return []
}

const buildHistoryMapFromRecords = (records, contributionIdSet, currentUserId) => {
  if (!Array.isArray(records)) return {}

  const historyMap = {}

  records.forEach((record) => {
    if (!record || typeof record !== 'object') return

    const contributionId = getHistoryContributionId(record)
    if (!isValidIdentifier(contributionId)) return

    const contributionKey = String(contributionId)

    if (contributionIdSet instanceof Set && !contributionIdSet.has(contributionKey)) {
      return
    }

    const recordUserId = getValue(record, ['user_id', 'uid', 'userId'], null)
    if (isValidIdentifier(currentUserId) && isValidIdentifier(recordUserId) && String(recordUserId) !== String(currentUserId)) {
      return
    }

    const existingRecord = historyMap[contributionKey]
    const recordTimestamp = getDateTimestamp(getHistoryDateValue(record)) ?? -Infinity
    const existingTimestamp = getDateTimestamp(getHistoryDateValue(existingRecord)) ?? -Infinity

    if (!existingRecord || recordTimestamp >= existingTimestamp) {
      historyMap[contributionKey] = record
    }
  })

  return historyMap
}

const normalizeHistoryRecordsForContribution = (records, contributionId, currentUserId) => {
  if (!Array.isArray(records) || !isValidIdentifier(contributionId)) return []

  const contributionKey = String(contributionId)

  return records
    .filter((record) => {
      if (!record || typeof record !== 'object') return false

      const recordContributionId = getHistoryContributionId(record)
      if (isValidIdentifier(recordContributionId) && String(recordContributionId) !== contributionKey) {
        return false
      }

      const recordUserId = getValue(record, ['user_id', 'uid', 'userId'], null)
      if (isValidIdentifier(currentUserId) && isValidIdentifier(recordUserId) && String(recordUserId) !== String(currentUserId)) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      const dateA = getDateTimestamp(getHistoryDateValue(a)) ?? -Infinity
      const dateB = getDateTimestamp(getHistoryDateValue(b)) ?? -Infinity
      return dateB - dateA
    })
}

const getHistoryRecordId = (item) => getValue(item, ['id', 'history_id', 'contribution_history_id', 'log_id'], null)

const getUploadPathFromResponse = (response) => (
  response?.data?.uri
  ?? response?.data?.url
  ?? response?.data?.path
  ?? response?.uri
  ?? response?.url
  ?? response?.path
  ?? null
)

const readCurrentUserId = () => {
  try {
    const rawProfile = localStorage.getItem('userProfile')
    if (!rawProfile) return null
    const parsedProfile = JSON.parse(rawProfile)
    const userId = parsedProfile?.user_id ?? parsedProfile?.id ?? null
    return isValidIdentifier(userId) ? userId : null
  } catch {
    return null
  }
}

const MySubmissionPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()

  const currentUserId = useMemo(readCurrentUserId, [])

  const [openMenus, setOpenMenus] = useState({
    'Quick Submission': true,
    'My Submission': true
  })
  const [submissionList, setSubmissionList] = useState([])
  const [submissionLoading, setSubmissionLoading] = useState(true)
  const [submissionError, setSubmissionError] = useState(false)
  const [historyByContribution, setHistoryByContribution] = useState({})
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
  const [processingSubmission, setProcessingSubmission] = useState(null)
  const [uploadedFilePath, setUploadedFilePath] = useState('')
  const [processNote, setProcessNote] = useState('')
  const [processingHistoryList, setProcessingHistoryList] = useState([])
  const [processingHistoryLoading, setProcessingHistoryLoading] = useState(false)
  const [processSubmitting, setProcessSubmitting] = useState(false)

  const loadingSubmissionText = language === 'zh' ? '\u52a0\u8f7d\u4e2d...' : 'Loading...'
  const errorSubmissionText = language === 'zh' ? '\u52a0\u8f7d\u5931\u8d25' : 'Failed to load'
  const emptySubmissionText = panels.submission.empty[language]

  const uiText = {
    id: language === 'zh' ? 'id' : 'ID',
    annotatedDownloadColumn: language === 'zh' ? '\u6279\u6ce8\u8bba\u6587\u4e0b\u8f7d' : 'Annotated File Download',
    processColumn: language === 'zh' ? '\u5904\u7406' : 'Process',
    updatedAtColumn: language === 'zh' ? '\u66f4\u65b0\u65e5\u671f' : 'Updated At',
    processModalTitle: language === 'zh' ? '\u6295\u7a3f\u5904\u7406' : 'Process Submission',
    downloadAnnotatedFile: language === 'zh' ? '\u4e0b\u8f7d\u6279\u6ce8\u6587\u4ef6' : 'Download Annotated File',
    uploadFile: language === 'zh' ? '\u4e0a\u4f20\u6587\u4ef6' : 'Upload File',
    note: language === 'zh' ? '\u5907\u6ce8' : 'Note',
    download: language === 'zh' ? '\u4e0b\u8f7d' : 'Download',
    submit: language === 'zh' ? '\u63d0\u4ea4' : 'Submit',
    uploadPlaceholder: language === 'zh' ? '\u8bf7\u4e0a\u4f20\u6587\u4ef6' : 'Please upload a file',
    notePlaceholder: language === 'zh' ? '\u8bf7\u8f93\u5165\u5907\u6ce8' : 'Please enter note',
    uploadSuccess: language === 'zh' ? '\u4e0a\u4f20\u6210\u529f' : 'Upload succeeded',
    uploadFailed: language === 'zh' ? '\u4e0a\u4f20\u5931\u8d25' : 'Upload failed',
    uploadRequired: language === 'zh' ? '\u8bf7\u5148\u4e0a\u4f20\u6587\u4ef6' : 'Please upload file first',
    invalidSubmission: language === 'zh' ? '\u6295\u7a3f\u4fe1\u606f\u65e0\u6548' : 'Invalid submission',
    processSuccess: language === 'zh' ? '\u63d0\u4ea4\u6210\u529f' : 'Submitted successfully',
    processFailed: language === 'zh' ? '\u63d0\u4ea4\u5931\u8d25' : 'Submission failed',
    historySectionTitle: language === 'zh' ? '\u6295\u7a3f\u5386\u53f2\u8bb0\u5f55' : 'Submission History',
    historyContributionIdColumn: language === 'zh' ? '\u6295\u7a3fID' : 'Contribution ID',
    historyUserIdColumn: language === 'zh' ? '\u7528\u6237ID' : 'User ID',
    historyLoading: language === 'zh' ? '\u5386\u53f2\u8bb0\u5f55\u52a0\u8f7d\u4e2d...' : 'Loading history records...',
    historyEmpty: language === 'zh' ? '\u6682\u65e0\u5386\u53f2\u8bb0\u5f55' : 'No history records'
  }

  const toggleMenu = (key, hasChildren) => {
    if (!hasChildren) return
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleNavClick = (key) => {
    const submissionStatusMap = {
      'Under Review': 0,
      'Need to Revise': 1,
      'Accepted': 2,
      'Published': 4,
      'Rejected': 3,
      'Withdrawal': 3
    }

    if (key === 'All My Submission') {
      navigate('/dashboard/my-submission')
      return
    }

    if (Object.prototype.hasOwnProperty.call(submissionStatusMap, key)) {
      navigate(`/dashboard/my-submission?status=${submissionStatusMap[key]}`)
      return
    }

    if (key === 'Logout') {
      authAPI.logout()
      navigate('/login')
      return
    }

    if (key === 'New Submission') {
      navigate('/dashboard/new-submission')
      return
    }
    if (key === 'Account Info') {
      navigate('/dashboard/account-info')
      return
    }
    if (key === 'Join Editor-in-chief Group') {
      navigate('/dashboard/join-editor-in-chief')
      return
    }
  }

  const formatDate = (value, fallback = '--') => {
    const timestamp = getDateTimestamp(value)
    if (timestamp === null) return fallback

    const locale = language === 'zh' ? 'zh-CN' : 'en-US'
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(timestamp))
  }

  const formatDateTime = (value, fallback = '--') => {
    const timestamp = getDateTimestamp(value)
    if (timestamp === null) return fallback

    const locale = language === 'zh' ? 'zh-CN' : 'en-US'
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp))
  }

  const rawStatusFilter = searchParams.get('status')
  const statusFilter = rawStatusFilter === null || rawStatusFilter === '' ? null : Number(rawStatusFilter)
  const statusDisplayMap = {
    0: { en: 'Under Review', zh: '\u5ba1\u7a3f\u4e2d' },
    1: { en: 'Revised', zh: '\u5df2\u4fee\u6539' },
    2: { en: 'Accepted', zh: '\u5df2\u5f55\u7528' },
    3: { en: 'Withdrawal', zh: '\u9000\u7a3f' },
    4: { en: 'Published', zh: '\u5df2\u53d1\u8868' },
    5: { en: 'Rejected', zh: '\u5df2\u62d2\u7a3f' },
    6: { en: 'Withdrawal', zh: '\u9000\u7a3f' }
  }
  const statusAliasMap = {
    0: ['Under Review', '\u5ba1\u7a3f\u4e2d'],
    1: ['Revised', 'Need to Revise', '\u5df2\u4fee\u6539', '\u9700\u4fee\u6539'],
    2: ['Accepted', '\u5df2\u5f55\u7528'],
    3: ['Withdrawal', 'Withdrawn', 'Rejected', '\u9000\u7a3f', '\u5df2\u62d2\u7a3f'],
    4: ['Published', '\u5df2\u53d1\u8868'],
    5: ['Rejected', '\u5df2\u62d2\u7a3f'],
    6: ['Withdrawal', '\u9000\u7a3f']
  }

  const getStatusCodeByText = (statusText) => {
    if (!isValidIdentifier(statusText)) return null

    const normalizedStatusText = String(statusText).trim()
    if (!normalizedStatusText) return null

    for (const [statusCode, aliases] of Object.entries(statusAliasMap)) {
      if (aliases.includes(normalizedStatusText)) {
        return Number(statusCode)
      }
    }

    return null
  }

  const matchesStatusFilter = (item) => {
    if (statusFilter === null || Number.isNaN(statusFilter)) return true

    const numericStatus = item?.status
    if (numericStatus !== undefined && numericStatus !== null && numericStatus !== '') {
      if (Number(numericStatus) === statusFilter) return true
    }

    const statusText = getValue(item, ['status_text', 'statusText', 'status'], null)
    if (!statusText) return false

    return statusAliasMap[statusFilter]?.includes(statusText) ?? false
  }

  const getDisplayStatus = (item) => {
    const statusValue = getValue(item, ['status'], null)
    const numericStatus = Number(statusValue)
    if (!Number.isNaN(numericStatus) && statusDisplayMap[numericStatus]) {
      return statusDisplayMap[numericStatus][language] || statusDisplayMap[numericStatus].en
    }

    const statusText = getValue(item, ['status_text', 'statusText', 'status'], null)
    const statusCodeByText = getStatusCodeByText(statusText)
    if (statusCodeByText !== null && statusDisplayMap[statusCodeByText]) {
      return statusDisplayMap[statusCodeByText][language] || statusDisplayMap[statusCodeByText].en
    }

    return isValidIdentifier(statusText) ? statusText : '--'
  }

  const visibleSubmissionList = submissionList.filter(matchesStatusFilter)

  const getLatestHistoryBySubmission = (submissionItem) => {
    const submissionId = getSubmissionId(submissionItem)
    if (isValidIdentifier(submissionId)) {
      const historyFromMap = historyByContribution[String(submissionId)]
      if (historyFromMap) return historyFromMap
    }
    return pickLatestHistoryRecord(getEmbeddedHistoryRecords(submissionItem))
  }

  const canProcessSubmission = (item) => {
    const numericStatus = Number(getValue(item, ['status'], null))
    if (!Number.isNaN(numericStatus)) {
      return numericStatus === 1
    }

    const statusText = getValue(item, ['status_text', 'statusText', 'status'], null)
    return statusAliasMap[1]?.includes(statusText) ?? false
  }

  const handleDownloadFile = (filePath) => {
    if (!isValidIdentifier(filePath)) return

    const link = document.createElement('a')
    link.href = filePath
    link.download = ''
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const loadContributionHistoryForContribution = async (contributionId, options = {}) => {
    if (!isValidIdentifier(contributionId)) return null

    const { updateProcessingList = false } = options
    const contributionKey = String(contributionId)

    if (updateProcessingList) {
      setProcessingHistoryLoading(true)
    }

    try {
      const params = {
        contribution_id: contributionId,
        page_size: 200
      }

      if (isValidIdentifier(currentUserId)) {
        params.user_id = currentUserId
      }

      let historyResponse

      try {
        historyResponse = await submissionAPI.queryContributionHistory(params)
      } catch {
        historyResponse = await submissionAPI.getContributionHistoryList(params)
      }

      const historyList = extractListFromResponse(historyResponse)
      const normalizedHistoryList = normalizeHistoryRecordsForContribution(historyList, contributionId, currentUserId)
      const historyMap = buildHistoryMapFromRecords(normalizedHistoryList, new Set([contributionKey]), currentUserId)
      const latestRecord = historyMap[contributionKey] || pickLatestHistoryRecord(normalizedHistoryList)

      if (latestRecord) {
        setHistoryByContribution((prev) => ({
          ...prev,
          [contributionKey]: latestRecord
        }))
      }

      if (updateProcessingList) {
        setProcessingHistoryList(normalizedHistoryList)
      }

      return latestRecord
    } catch (historyError) {
      console.warn('Failed to load contribution history:', historyError)

      if (updateProcessingList) {
        setProcessingHistoryList([])
      }

      return null
    } finally {
      if (updateProcessingList) {
        setProcessingHistoryLoading(false)
      }
    }
  }

  const handleOpenProcessModal = (submissionItem) => {
    const latestHistory = getLatestHistoryBySubmission(submissionItem)

    setProcessingSubmission(submissionItem)
    setUploadedFilePath('')
    setProcessNote(getHistoryNote(latestHistory, ''))
    setProcessingHistoryList([])
    setIsProcessModalOpen(true)

    const submissionId = getSubmissionId(submissionItem)
    if (isValidIdentifier(submissionId)) {
      void loadContributionHistoryForContribution(submissionId, { updateProcessingList: true })
    } else {
      setProcessingHistoryLoading(false)
    }
  }

  const handleCloseProcessModal = () => {
    setIsProcessModalOpen(false)
    setProcessingSubmission(null)
    setUploadedFilePath('')
    setProcessNote('')
    setProcessingHistoryList([])
    setProcessingHistoryLoading(false)
  }

  const handleProcessUpload = ({ file, onSuccess, onError }) => {
    submissionAPI.uploadFile(file)
      .then((response) => {
        const uploadPath = getUploadPathFromResponse(response)
        if (!isValidIdentifier(uploadPath)) {
          throw new Error(uiText.uploadFailed)
        }

        setUploadedFilePath(uploadPath)
        message.success(uiText.uploadSuccess)
        onSuccess?.('ok')
      })
      .catch((error) => {
        message.error(error?.message || uiText.uploadFailed)
        onError?.(error)
      })
  }

  const handleProcessSubmit = async () => {
    const submissionId = getSubmissionId(processingSubmission)
    if (!isValidIdentifier(submissionId)) {
      message.error(uiText.invalidSubmission)
      return
    }

    if (!isValidIdentifier(uploadedFilePath)) {
      message.error(uiText.uploadRequired)
      return
    }

    const payload = {
      contribution_id: submissionId,
      updated_file: uploadedFilePath,
      note: processNote
    }

    if (isValidIdentifier(currentUserId)) {
      payload.user_id = currentUserId
    }

    setProcessSubmitting(true)
    message.loading({ content: uiText.submit, key: 'process-submission' })

    try {
      const response = await submissionAPI.saveContributionHistory(payload)

      if (response?.code === 0 || response?.code === '0') {
        throw new Error(response?.msg || uiText.processFailed)
      }

      message.success({ content: response?.msg || uiText.processSuccess, key: 'process-submission' })
      setIsProcessModalOpen(false)
      setProcessingSubmission(null)
      setUploadedFilePath('')
      setProcessNote('')
      setProcessingHistoryList([])
      setProcessingHistoryLoading(false)
      await loadContributionHistoryForContribution(submissionId)
    } catch (error) {
      message.error({ content: error?.message || uiText.processFailed, key: 'process-submission' })
    } finally {
      setProcessSubmitting(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchMyContribution = async () => {
      setSubmissionLoading(true)
      setSubmissionError(false)

      try {
        const response = await submissionAPI.getMyContribution()
        const list = extractListFromResponse(response)

        if (!isMounted) return

        setSubmissionList(list)

        const embeddedHistoryMap = {}
        const contributionIdSet = new Set()

        list.forEach((submissionItem) => {
          const submissionId = getSubmissionId(submissionItem)
          if (isValidIdentifier(submissionId)) {
            contributionIdSet.add(String(submissionId))
          }

          const latestEmbeddedHistory = pickLatestHistoryRecord(getEmbeddedHistoryRecords(submissionItem))
          if (isValidIdentifier(submissionId) && latestEmbeddedHistory) {
            embeddedHistoryMap[String(submissionId)] = latestEmbeddedHistory
          }
        })

        setHistoryByContribution(embeddedHistoryMap)

        if (contributionIdSet.size > 0) {
          try {
            const contributionIds = Array.from(contributionIdSet)
            const historyParams = {
              contribution_ids: contributionIds.join(','),
              page_size: 500
            }

            if (contributionIds.length === 1) {
              historyParams.contribution_id = contributionIds[0]
            }

            if (isValidIdentifier(currentUserId)) {
              historyParams.user_id = currentUserId
            }

            let historyResponse

            try {
              historyResponse = await submissionAPI.queryContributionHistory(historyParams)
            } catch {
              historyResponse = await submissionAPI.getContributionHistoryList(historyParams)
            }

            const historyList = extractListFromResponse(historyResponse)
            const historyMap = buildHistoryMapFromRecords(historyList, contributionIdSet, currentUserId)

            if (isMounted && Object.keys(historyMap).length > 0) {
              setHistoryByContribution((prev) => ({
                ...prev,
                ...historyMap
              }))
            }
          } catch (historyError) {
            console.warn('Failed to load contribution history list:', historyError)
          }
        }
      } catch (error) {
        console.error('Failed to load my contribution:', error)
        if (isMounted) {
          setSubmissionList([])
          setHistoryByContribution({})
          setSubmissionError(true)
        }
      } finally {
        if (isMounted) {
          setSubmissionLoading(false)
        }
      }
    }

    fetchMyContribution()

    return () => {
      isMounted = false
    }
  }, [currentUserId])

  const processingHistoryRecord = processingHistoryList[0]
    || (processingSubmission ? getLatestHistoryBySubmission(processingSubmission) : null)
  const processingHistoryDownloadPath = getHistoryFilePath(processingHistoryRecord)

  return (
    <div className="dashboard-page">
      <Header />
      <section className="dashboard-section">
        <div className="dashboard-shell">
          <aside className="dashboard-sidebar">
            <nav className="sidebar-nav">
              {navItems.map((item) => {
                const hasChildren = Boolean(item.children?.length)
                const isOpen = Boolean(openMenus[item.key])
                return (
                  <div key={item.key} className={`nav-group ${hasChildren ? 'has-children' : ''} ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="nav-item"
                      onClick={() => toggleMenu(item.key, hasChildren)}
                      aria-expanded={hasChildren ? isOpen : undefined}
                    >
                      <span className="nav-icon">
                        <PlusOutlined />
                      </span>
                      <span className="nav-label">{item.label[language] || item.label.en}</span>
                    </button>
                    {hasChildren && (
                      <div className="nav-children">
                        {item.children.map((child) => (
                          <button key={child.key} type="button" className="nav-child" onClick={() => handleNavClick(child.key)}>
                            {child.label[language] || child.label.en}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </aside>

          <main className="dashboard-content">
            <div className="dashboard-panels">
              <section className="panel panel-blue">
                <header>
                  <h2>{panels.submission.title[language]}</h2>
                  <span className="panel-tag">{panels.submission.tag[language]}</span>
                </header>
                <div className="submission-table-wrap">
                  <table className="submission-table">
                    <thead>
                      <tr>
                        <th>{panels.submission.columns.paperId[language]}</th>
                        <th>{panels.submission.columns.paperTitle[language]}</th>
                        <th>{panels.submission.columns.journal[language]}</th>
                        <th>{panels.submission.columns.status[language]}</th>
                        <th>{panels.submission.columns.submissionDate[language]}</th>
                        <th>{uiText.processColumn}</th>
                        <th>{uiText.updatedAtColumn}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissionLoading && (
                        <tr>
                          <td colSpan="7" className="empty-row">{loadingSubmissionText}</td>
                        </tr>
                      )}
                      {!submissionLoading && submissionError && (
                        <tr>
                          <td colSpan="7" className="empty-row">{errorSubmissionText}</td>
                        </tr>
                      )}
                      {!submissionLoading && !submissionError && visibleSubmissionList.length === 0 && (
                        <tr>
                          <td colSpan="7" className="empty-row">{emptySubmissionText}</td>
                        </tr>
                      )}
                      {!submissionLoading && !submissionError && visibleSubmissionList.length > 0 && (
                        visibleSubmissionList.map((item, index) => {
                          const submissionId = getSubmissionId(item)
                          const rowKey = submissionId ?? `submission-${index}`
                          const latestHistory = getLatestHistoryBySubmission(item)
                          const latestHistoryDate = getHistoryDateValue(latestHistory)

                          return (
                            <tr key={rowKey}>
                              <td>{getValue(item, ['paper_id', 'paperId', 'contribution_id', 'contributionId', 'contribute_id', 'id'])}</td>
                              <td>{getValue(item, ['paper_title', 'paperTitle', 'title'])}</td>
                              <td>{getValue(item, ['journal_name', 'journal', 'journalName'])}</td>
                              <td>{getDisplayStatus(item)}</td>
                              <td>{formatDate(getValue(item, ['create_time', 'submission_date', 'submissionDate', 'submitted_at', 'created_at']))}</td>
                              <td>
                                {canProcessSubmission(item) ? (
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => handleOpenProcessModal(item)}
                                  >
                                    {uiText.processColumn}
                                  </Button>
                                ) : ''}
                              </td>
                              <td>{formatDate(latestHistoryDate)}</td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </main>
        </div>
      </section>

      <Modal
        title={uiText.processModalTitle}
        open={isProcessModalOpen}
        onCancel={handleCloseProcessModal}
        footer={null}
        width={980}
        wrapClassName="process-submission-modal"
        destroyOnClose
      >
        <div className="process-modal-content">
          <form
            className="process-modal-form"
            onSubmit={(event) => {
              event.preventDefault()
              void handleProcessSubmit()
            }}
          >
            <div className="process-form-item">
              <div className="process-form-label">{uiText.downloadAnnotatedFile}</div>
              <div>
                {isValidIdentifier(processingHistoryDownloadPath) ? (
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    className="table-link-btn"
                    onClick={() => handleDownloadFile(processingHistoryDownloadPath)}
                  >
                    {uiText.download}
                  </Button>
                ) : '--'}
              </div>
            </div>

            <div className="process-form-item">
              <div className="process-form-label">{uiText.uploadFile}</div>
              <div className="process-upload-row">
                <Input
                  value={uploadedFilePath}
                  placeholder={uiText.uploadPlaceholder}
                  readOnly
                />
                <Upload
                  showUploadList={false}
                  accept=".doc,.docx,.pdf,.txt,.zip,.rar,.7z"
                  customRequest={handleProcessUpload}
                >
                  <Button icon={<UploadOutlined />}>{uiText.uploadFile}</Button>
                </Upload>
              </div>
            </div>

            <div className="process-form-item">
              <div className="process-form-label">{uiText.note}</div>
              <Input.TextArea
                className="process-note-box"
                value={processNote}
                onChange={(event) => setProcessNote(event.target.value)}
                placeholder={uiText.notePlaceholder}
                rows={4}
              />
            </div>

            <div className="process-form-actions">
              <Button type="primary" htmlType="submit" loading={processSubmitting}>
                {uiText.submit}
              </Button>
            </div>
          </form>

          <section className="process-history-section">
            <h3 className="process-history-title">{uiText.historySectionTitle}</h3>
            <div className="process-history-table-wrap">
              <table className="process-history-table">
                <thead>
                  <tr>
                    <th>{uiText.id}</th>
                    <th>{uiText.historyContributionIdColumn}</th>
                    <th>{uiText.historyUserIdColumn}</th>
                    <th>{uiText.updatedAtColumn}</th>
                    <th>{uiText.annotatedDownloadColumn}</th>
                    <th>{uiText.note}</th>
                  </tr>
                </thead>
                <tbody>
                  {processingHistoryLoading && (
                    <tr>
                      <td colSpan="6" className="empty-row">{uiText.historyLoading}</td>
                    </tr>
                  )}

                  {!processingHistoryLoading && processingHistoryList.length === 0 && (
                    <tr>
                      <td colSpan="6" className="empty-row">{uiText.historyEmpty}</td>
                    </tr>
                  )}

                  {!processingHistoryLoading && processingHistoryList.length > 0 && processingHistoryList.map((historyItem, index) => {
                    const historyRowId = getHistoryRecordId(historyItem)
                    const historyContributionId = getHistoryContributionId(historyItem)
                    const historyUserId = getHistoryUserId(historyItem)
                    const historyFilePath = getHistoryFilePath(historyItem)
                    const historyDateValue = getHistoryDateValue(historyItem)

                    return (
                      <tr key={historyRowId ?? `history-${index}`}>
                        <td>{historyRowId ?? index + 1}</td>
                        <td>{isValidIdentifier(historyContributionId) ? historyContributionId : '--'}</td>
                        <td>{isValidIdentifier(historyUserId) ? historyUserId : '--'}</td>
                        <td>{formatDateTime(historyDateValue)}</td>
                        <td>
                          {isValidIdentifier(historyFilePath) ? (
                            <Button
                              type="link"
                              icon={<DownloadOutlined />}
                              className="table-link-btn"
                              onClick={() => handleDownloadFile(historyFilePath)}
                            >
                              {uiText.download}
                            </Button>
                          ) : '--'}
                        </td>
                        <td>{getHistoryNote(historyItem)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}

export default MySubmissionPage
