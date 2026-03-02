import React, { useState } from 'react'
import { useScan } from '../context/ScanContext'
import { ShieldAlert } from 'lucide-react'

const VulnerabilitiesPage = () => {
  const { findings } = useScan()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'all' 
    ? findings 
    : findings.filter(f => f.severity === filter)

  return (
    <div className="flex flex-col gap-6">

      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Vulnerability <span className="text-[#00f5a0]">Explorer</span>
          </h1>
          <p className="font-mono text-[11px] text-[#4a6a80] mt-1">
            $ vibeguard findings --list --sort severity
          </p>
        </div>
        <span className="font-mono text-[11px] text-[#4a6a80] border border-[#1a2e44] px-3 py-1 rounded">
          {findings.length} total findings
        </span>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        {[
          { label: 'ALL', value: 'all', color: '#c8dce8' },
          { label: 'CRITICAL', value: 'critical', color: '#ff4560' },
          { label: 'HIGH', value: 'high', color: '#f5a623' },
          { label: 'MEDIUM', value: 'medium', color: '#7b61ff' },
          { label: 'LOW', value: 'low', color: '#4a6a80' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="font-mono text-[11px] px-4 py-1.5 rounded-md border transition-all duration-200"
            style={{
              color: filter === f.value ? f.color : '#4a6a80',
              borderColor: filter === f.value ? f.color : '#1a2e44',
              background: filter === f.value ? `${f.color}15` : 'transparent'
            }}>
            {f.label}
            <span className="ml-2 text-[10px]">
              {f.value === 'all' 
                ? findings.length 
                : findings.filter(x => x.severity === f.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex gap-5">

        {/* Vulnerability Table */}
        <div className="flex-1 rounded-xl border border-[#1a2e44] bg-[#0b1520] overflow-hidden">
          
          <div className="px-5 py-4 border-b border-[#1a2e44]">
            <h2 className="text-sm font-bold text-white">
              {filtered.length} {filter === 'all' ? 'Total' : filter.toUpperCase()} Findings
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <ShieldAlert size={32} className="text-[#1a2e44]" />
              <p className="font-mono text-[11px] text-[#4a6a80]">
                {findings.length === 0 ? 'No scan results yet' : 'No findings for this filter'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2e44]">
                  <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Title</th>
                  <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Severity</th>
                  <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Type</th>
                  <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Validated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((finding, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelected(finding)}
                    className={`border-b border-[#1a2e44] cursor-pointer transition-colors ${
                      selected?.title === finding.title
                        ? 'bg-[#00f5a0]/5'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="px-5 py-3 text-sm text-[#c8dce8] max-w-[200px] truncate">
                      {finding.title}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] font-mono font-bold px-2 py-1 rounded"
                        style={{
                          color: finding.severity === 'critical' ? '#ff4560' : finding.severity === 'high' ? '#f5a623' : finding.severity === 'medium' ? '#7b61ff' : '#4a6a80',
                          background: finding.severity === 'critical' ? 'rgba(255,69,96,0.1)' : finding.severity === 'high' ? 'rgba(245,166,35,0.1)' : finding.severity === 'medium' ? 'rgba(123,97,255,0.1)' : 'rgba(74,106,128,0.1)'
                        }}>
                        {finding.severity?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-[#4a6a80] max-w-[150px] truncate">
                      {finding.type}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-mono ${finding.validated ? 'text-[#00f5a0]' : 'text-[#4a6a80]'}`}>
                        {finding.validated ? '✓ Confirmed' : '○ Unconfirmed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-[40%] rounded-xl border border-[#1a2e44] bg-[#0b1520] p-5 flex flex-col gap-4 overflow-y-auto max-h-[600px]">
            
            {/* Detail Header */}
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-1 rounded"
                style={{
                  color: selected.severity === 'critical' ? '#ff4560' : selected.severity === 'high' ? '#f5a623' : '#7b61ff',
                  background: selected.severity === 'critical' ? 'rgba(255,69,96,0.1)' : selected.severity === 'high' ? 'rgba(245,166,35,0.1)' : 'rgba(123,97,255,0.1)'
                }}>
                {selected.severity?.toUpperCase()}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="text-[#4a6a80] hover:text-white text-xs font-mono transition-colors">
                ✕ CLOSE
              </button>
            </div>

            {/* Title */}
            <p className="text-sm font-bold text-white leading-relaxed">{selected.title}</p>

            {/* Description */}
            <div>
              <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-1">Description</p>
              <p className="text-xs text-[#c8dce8] leading-relaxed">{selected.description}</p>
            </div>

            {/* Evidence */}
            <div>
              <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-1">Evidence</p>
              <p className="text-[11px] font-mono text-[#00f5a0] bg-[#00f5a0]/5 border border-[#00f5a0]/20 rounded p-3 leading-relaxed">
                {selected.evidence}
              </p>
            </div>

            {/* Reproduction */}
            {selected.reproduction?.length > 0 && (
              <div>
                <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-2">Reproduction</p>
                <ol className="flex flex-col gap-2">
                  {selected.reproduction.map((step, i) => (
                    <li key={i} className="flex gap-2 text-xs text-[#c8dce8]">
                      <span className="text-[#00f5a0] font-mono font-bold shrink-0">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Remediation */}
            <div>
              <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-1">Remediation</p>
              <p className="text-xs text-[#c8dce8] leading-relaxed">{selected.remediation}</p>
            </div>

          </div>
        )}

      </div>



    </div>
  )
}

export default VulnerabilitiesPage