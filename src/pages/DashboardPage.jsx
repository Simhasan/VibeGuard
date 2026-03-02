import React from 'react'
import { useScan } from '../context/ScanContext'

const DashboardPage = () => {

  const { findings } = useScan()
  const [selected, setSelected] = React.useState(null)

  const stats = [
    { label: 'Critical', count: findings.filter(f => f.severity === 'critical').length, color: '#ff4560', bg: 'rgba(255,69,96,0.08)' },
    { label: 'High', count: findings.filter(f => f.severity === 'high').length, color: '#f5a623', bg: 'rgba(245,166,35,0.08)' },
    { label: 'Medium', count: findings.filter(f => f.severity === 'medium').length, color: '#7b61ff', bg: 'rgba(123,97,255,0.08)' },
    { label: 'Total', count: findings.length, color: '#00f5a0', bg: 'rgba(0,245,160,0.08)' },
  ]

  return (
    <div className="flex flex-col gap-6 ">

      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Security <span className="text-[#00f5a0]">Dashboard</span>
          </h1>
          <p className="font-mono text-[11px] text-[#4a6a80] mt-1">
            $ vibeguard scan --provider ollama --model mistral:latest
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#1a2e44] p-5"
            style={{ background: stat.bg }}
          >
            <p className="font-mono text-[10px] tracking-widest uppercase mb-3"
              style={{ color: stat.color }}>
              {stat.label}
            </p>
            <p className="text-4xl font-extrabold tracking-tight"
              style={{ color: stat.color }}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>{/* Vulnerability Table */}


      <div className="rounded-xl border border-[#1a2e44] bg-[#0b1520] overflow-hidden">

        {/* Table Header */}
        <div className="px-5 py-4 border-b border-[#1a2e44]">
          <h2 className="text-sm font-bold text-white">Findings</h2>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a2e44]">
              <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Vulnerability</th>
              <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Type</th>
              <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Severity</th>
              <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Target</th>
              <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Validated</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((finding, index) => (
              <tr
                key={index}
                onClick={() => setSelected(finding)}
                className="border-b border-[#1a2e44] hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="px-5 py-3 text-sm text-[#c8dce8] max-w-50 truncate">{finding.title}</td>
                <td className="px-5 py-3 text-xs font-mono text-[#4a6a80]">{finding.type}</td>
                <td className="px-5 py-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded"
                    style={{
                      color: finding.severity === 'critical' ? '#ff4560' : finding.severity === 'high' ? '#f5a623' : '#7b61ff',
                      background: finding.severity === 'critical' ? 'rgba(255,69,96,0.1)' : finding.severity === 'high' ? 'rgba(245,166,35,0.1)' : 'rgba(123,97,255,0.1)'
                    }}>
                    {finding.severity.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs font-mono text-[#4a6a80] max-w-37.5 truncate">{finding.target}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-mono ${finding.validated ? 'text-[#00f5a0]' : 'text-[#4a6a80]'}`}>
                    {finding.validated ? '✓ Confirmed' : '○ Unconfirmed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="rounded-xl border border-[#1a2e44] bg-[#0b1520] p-6">

          {/* Detail Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-white mb-1">{selected.title}</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-1 rounded"
                style={{
                  color: selected.severity === 'critical' ? '#ff4560' : selected.severity === 'high' ? '#f5a623' : '#7b61ff',
                  background: selected.severity === 'critical' ? 'rgba(255,69,96,0.1)' : selected.severity === 'high' ? 'rgba(245,166,35,0.1)' : 'rgba(123,97,255,0.1)'
                }}>
                {selected.severity.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-[#4a6a80] hover:text-white text-xs font-mono transition-colors"
            >
              ✕ CLOSE
            </button>
          </div>

          {/* Detail Grid */}
          <div className="grid grid-cols-2 gap-6">

            {/* Left Column */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-1">Description</p>
                <p className="text-sm text-[#c8dce8] leading-relaxed">{selected.description}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-1">Evidence</p>
                <p className="text-xs font-mono text-[#00f5a0] bg-[#00f5a0]/5 border border-[#00f5a0]/20 rounded p-3 leading-relaxed">{selected.evidence}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-1">Impact</p>
                <p className="text-sm text-[#c8dce8] leading-relaxed">{selected.impact}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-2">Reproduction Steps</p>
                <ol className="flex flex-col gap-2">
                  {selected.reproduction.map((step, i) => (
                    <li key={i} className="flex gap-2 text-xs text-[#c8dce8]">
                      <span className="text-[#00f5a0] font-mono font-bold shrink-0">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-1">Remediation</p>
                <p className="text-sm text-[#c8dce8] leading-relaxed">{selected.remediation}</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default DashboardPage


