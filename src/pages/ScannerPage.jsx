import React from 'react'
import { useScan } from '../context/ScanContext'
import { ScanLine } from 'lucide-react'

const ScannerPage = () => {
  const { scanStatus, scanProgress, targetURL, activeScanId, actionPlan, liveFeed } = useScan()

  return (
    <div className="flex flex-col gap-6">

      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Scan <span className="text-[#00f5a0]">Manager</span>
          </h1>
          <p className="font-mono text-[11px] text-[#4a6a80] mt-1">
            $ vibeguard scan --status --live
          </p>
        </div>

        {/* Status Badge */}
        <span className="font-mono text-[11px] font-bold px-3 py-1 rounded border"
          style={{
            color: scanStatus === 'running' ? '#00f5a0' : scanStatus === 'completed' ? '#00f5a0' : scanStatus === 'error' ? '#ff4560' : '#4a6a80',
            borderColor: scanStatus === 'running' ? '#00f5a0' : scanStatus === 'completed' ? '#00f5a0' : scanStatus === 'error' ? '#ff4560' : '#1a2e44',
            background: scanStatus === 'running' ? 'rgba(0,245,160,0.05)' : 'transparent'
          }}>
          {scanStatus === 'running' ? '● SCANNING' : scanStatus === 'completed' ? '✓ COMPLETED' : scanStatus === 'error' ? '✕ ERROR' : '○ IDLE'}
        </span>
      </div>

      {/* Top Row */}
      <div className="flex gap-5">

        {/* Scan Status Card */}
        <div className="flex-1 rounded-xl border border-[#1a2e44] bg-[#0b1520] p-5">
          
          <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-4">
            Current Scan
          </p>

          {/* Target URL */}
          <div className="mb-4">
            <p className="font-mono text-[10px] text-[#4a6a80] mb-1">TARGET</p>
            <p className="text-sm font-bold text-white truncate">
              {targetURL || '—'}
            </p>
          </div>

          {/* Scan ID */}
          <div className="mb-5">
            <p className="font-mono text-[10px] text-[#4a6a80] mb-1">SCAN ID</p>
            <p className="font-mono text-[11px] text-[#c8dce8] truncate">
              {activeScanId || '—'}
            </p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] text-[#4a6a80]">PROGRESS</p>
              <p className="font-mono text-[10px] text-[#00f5a0]">{scanProgress}%</p>
            </div>
            <div className="w-full h-2 bg-[#1a2e44] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00f5a0] rounded-full transition-all duration-500"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>

        </div>

        {/* Action Plan Card */}
        <div className="flex-1 rounded-xl border border-[#1a2e44] bg-[#0b1520] p-5">
          
          <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-4">
            Action Plan
          </p>

          {actionPlan.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <ScanLine size={24} className="text-[#1a2e44]" />
              <p className="font-mono text-[11px] text-[#4a6a80]">
                No active scan
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {actionPlan.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-mono text-[10px] mt-0.5 shrink-0"
                    style={{
                      color: step.includes('Completed') ? '#00f5a0' : 
                            step.includes('Error') ? '#ff4560' : '#f5a623'
                    }}>
                    {step.includes('Completed') ? '✓' : 
                    step.includes('Error') ? '✕' : '●'}
                  </span>
                  <p className="font-mono text-[11px] text-[#c8dce8] leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>  

      {/* Live Feed */}
    <div className="rounded-xl border border-[#1a2e44] bg-[#0b1520] overflow-hidden">

      {/* Feed Header */}
      <div className="px-5 py-4 border-b border-[#1a2e44] flex items-center justify-between">
        <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase">
          Live Feed
        </p>
        {scanStatus === 'running' && (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#00f5a0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] animate-pulse"/>
            LIVE
          </span>
        )}
      </div>

      {/* Feed Content */}
      <div className="p-4 h-64 overflow-y-auto flex flex-col gap-2 font-mono text-[11px]">
        {liveFeed.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#4a6a80]">Waiting for scan activity...</p>
          </div>
        ) : (
          [...liveFeed].reverse().map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[#4a6a80] shrink-0">{item.time}</span>
              <span style={{
                color: item.type === 'error' ? '#ff4560' :
                      item.type === 'success' ? '#00f5a0' :
                      item.type === 'warning' ? '#f5a623' : '#c8dce8'
              }}>
                {item.message}
              </span>
            </div>
          ))
        )}
      </div>

    </div>

    </div>
  )
}

export default ScannerPage