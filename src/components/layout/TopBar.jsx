import React, { useState } from 'react'
import { useScan } from '../../context/ScanContext'

const isValidURL = (url) => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const TopBar = () => {
  const { targetURL, setTargetURL, sessionId, scanStatus,
    setScanStatus, setScanProgress, setActiveScanId, setFindings, 
    scanProgress, addFeedItem } = useScan()
  const [urlError, setURLError] = useState('')

  const handleScan = async (e) => {
    e.preventDefault()
    if (!targetURL) return
    if (!isValidURL(targetURL)) {
      setURLError('Please enter a valid URL starting with http:// or https://')
      return
    }
    setURLError('')
    setScanStatus('running')
    setScanProgress(0)

    try {
      const savedSettings = JSON.parse(localStorage.getItem('vibeguard_settings') || '{}')
      const res = await fetch('http://localhost:5050/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          url: targetURL,
          config: {
            provider: 'ollama',
            model: savedSettings.model || 'mistral',
            ollama_url: savedSettings.ollamaUrl || 'http://localhost:11434',
            scope: savedSettings.scope || 'url',
            verbose: savedSettings.verbose || false
          }
        })
      })
      const data = await res.json()
      console.log('Scan response:', data)  // ← add this
      const scan_id = data.scan_id || (data.data && data.data.scan_id)
      if (scan_id) {
        setActiveScanId(scan_id)
        pollScanStatus(scan_id)
      } else {
        throw new Error('No scan_id received from server')
      }
    } catch (err) {
      console.error('Scan failed:', err)
      setScanStatus('idle')
      setURLError('Could not connect to server. Is it running?')
    }
  }

  const pollScanStatus = (scanId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5050/api/scan/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scan_id: scanId, session_id: sessionId })
        })
        const data = await res.json()
        const scan = data.scan || data.data?.scan

        if (scan) {
          setScanProgress(scan.progress || 0)

          const activeStatuses = ['initializing', 'running', 'preparing', 'generating_report']
          if (activeStatuses.includes(scan.status)) {
            setScanStatus('running')
            addFeedItem(`Agent progress: ${scan.progress}%`, 'info')
          }

          if (scan.status === 'completed') {
            clearInterval(interval)
            setScanStatus('completed')
            addFeedItem('Scan completed successfully', 'success')
            if (scan.report_dir) {
              const reportRes = await fetch(`http://localhost:5050/api/report/${scan.report_dir}`)
              const reportData = await reportRes.json()
              const findings = reportData.findings || reportData.data?.findings
              if (findings) {
                setFindings(findings)
              }
            }
          }

          if (scan.status === 'error') {
            clearInterval(interval)
            setScanStatus('error')
            addFeedItem('Scan encountered an error', 'error')
          }
        }
      } catch (err) {
        console.error('Polling error:', err)
        clearInterval(interval)
      }
    }, 3000)
  }

  return (
    <div className='flex items-center justify-between h-full w-full'>
      <div className='flex gap-1.5'>
        <img width="30" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3v9-s6NT7uXGzpHlYCBEfcHa1FIszG4em32vf4C5-yA&s" alt="hello" style={{ borderRadius: "50%" }} />
        <h3 className='font-sans text-2xl font-extrabold text-white'>Vibe <span className="text-green-300">Guard</span></h3>
      </div>

      <div className='flex-1 max-w-md flex flex-col gap-1'>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-slate-400 text-sm">
            {scanStatus === 'running' ? '🔒' : scanStatus === 'completed' ? '✓' : '🌐'}
          </span>
          <input
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault()
            }}
            type="text"
            placeholder='Enter the URL e.g. https://example.com'
            value={targetURL}
            onChange={(e) => {
              setTargetURL(e.target.value)
              setURLError('')
            }}
            disabled={scanStatus === 'running'}
            className={`w-full bg-slate-800 text-white pl-9 pr-4 py-1 rounded-md focus:outline-none transition-all duration-300 ${
              scanStatus === 'running'
                ? 'border border-[#00f5a0] opacity-60 cursor-not-allowed animate-pulse'
                : scanStatus === 'completed'
                  ? 'border border-[#00f5a0] opacity-90'
                  : urlError
                    ? 'border border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border border-slate-700 focus:ring-1 focus:ring-green-400'
            }`}
          />
        </div>
        {urlError && (
          <span className="font-mono text-[10px] text-red-400 pl-1">
            ⚠ {urlError}
          </span>
        )}
      </div>

      <div className='flex items-center gap-3'>
        {scanStatus === 'running' && (
          <div className="flex items-center gap-3">
            <div className="w-32 h-1.5 bg-[#1a2e44] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00f5a0] rounded-full transition-all duration-500"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-[#00f5a0]">{scanProgress}%</span>
            <span className="font-mono text-[11px] text-[#4a6a80]">SCANNING</span>
          </div>
        )}
        {scanStatus === 'completed' && (
          <span className="font-mono text-[11px] text-[#00f5a0] border border-[#00f5a0]/30 px-2 py-1 rounded">
            ✓ SCAN COMPLETE
          </span>
        )}
        {scanStatus !== 'running' ? (
          <button  type="button" onClick={handleScan} className='flex items-center justify-center bg-green-400 hover:bg-green-500 text-black font-medium px-6 py-1 rounded-md'>
            NEW SCAN
          </button>
        ) : (
          <button  type="button"  onClick={() => setScanStatus('idle')} className='flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-1 rounded-md'>
            STOP
          </button>
        )}
      </div>
    </div>
  )
}

export default TopBar