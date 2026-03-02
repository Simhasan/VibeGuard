import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react'
export const ScanDataContext = createContext()

const ScanContext = ({ children }) => {
  const [sessionId, setSessionId] = useState(null)
  const [targetURL, setTargetURL] = useState('')
  const [scanStatus, setScanStatus] = useState('idle')
  const [scanProgress, setScanProgress] = useState(0)
  const [vulnerabilities, setVulnerabilities] = useState([])
  const [activeScanId, setActiveScanId] = useState(null)
  const [liveFeed, setLiveFeed] = useState([])
  const [findings, setFindings] = useState([])
  const [actionPlan, setActionPlan] = useState([])

  const addFeedItem = useCallback((message, type = 'info') => {
    setLiveFeed(prev => [...prev, {
      message,
      type,
      time: new Date().toLocaleTimeString()
    }])
  }, [])

  const resetScan = useCallback(() => {
    setScanStatus('idle')
    setScanProgress(0)
    setVulnerabilities([])
    setActiveScanId(null)
    setLiveFeed([])
  }, [])

  useEffect(() => {
    const initSession = async () => {
      const existingSession = localStorage.getItem('vibeguard_session_id')
      if (existingSession) {
        setSessionId(existingSession)
        console.log('Reusing session:', existingSession)
        return
      }
      try {
        const res = await fetch('http://localhost:5050/api/session/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json()
        setSessionId(data.session_id)
        localStorage.setItem('vibeguard_session_id', data.session_id)
        console.log('New session created:', data.session_id)
      } catch (err) {
        console.error('Failed to init session:', err)
      }
    }
    initSession()
  }, [])

  // ← This is the key fix — memoize the value object
  const value = useMemo(() => ({
    targetURL, setTargetURL,
    scanStatus, setScanStatus,
    scanProgress, setScanProgress,
    vulnerabilities, setVulnerabilities,
    activeScanId, setActiveScanId,
    liveFeed, addFeedItem,
    resetScan, sessionId, setSessionId,
    findings, setFindings,
    actionPlan, setActionPlan,
  }), [
    targetURL, scanStatus, scanProgress,
    vulnerabilities, activeScanId, liveFeed,
    sessionId, findings, actionPlan,
    addFeedItem, resetScan
  ])

  return (
    <ScanDataContext.Provider value={value}>
      {children}
    </ScanDataContext.Provider>
  )
}

export const useScan = () => useContext(ScanDataContext)
export default ScanContext