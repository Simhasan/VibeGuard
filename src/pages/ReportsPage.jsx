import React, { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'

const ReportsPage = () => {
  const [reports, setReports] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('http://localhost:5050/api/reports')
        const data = await res.json()
        setReports(data.data?.reports || [])
      } catch (err) {
        console.error('Failed to fetch reports:', err)
      }
    }
    fetchReports()
  }, [])

  useEffect(() => {
    if (!selected) return
    const fetchReport = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/report/${selected.id}`)
        const data = await res.json()
        setSelected(prev => ({ ...prev, findings: data.data?.findings || [], summary: data.data?.summary }))
      } catch (err) {
        console.error('Failed to fetch report:', err)
      }
    }
    fetchReport()
  }, [selected?.id])

  return (
    <div className="flex flex-col gap-6 ">

      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Scan <span className="text-[#00f5a0]">Reports</span>
          </h1>
          <p className="font-mono text-[11px] text-[#4a6a80] mt-1">
            $ vibeguard reports --list --sort date
          </p>
        </div>
        <span className="font-mono text-[11px] text-[#4a6a80] border border-[#1a2e44] px-3 py-1 rounded">
          {reports.length} reports found
        </span>
      </div>
      {/* Main Content */}
      <div className="flex gap-5">

        {/* Reports List */}
        <div className="flex flex-col gap-3 w-[40%]">
          {reports.length === 0 ? (
            <div className="rounded-xl border border-[#1a2e44] bg-[#0b1520] p-8 flex flex-col items-center gap-3">
              <FileText size={32} className="text-[#1a2e44]" />
              <p className="font-mono text-[11px] text-[#4a6a80]">No reports found</p>
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelected(report)}
                className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 ${selected?.id === report.id
                    ? 'border-[#00f5a0] bg-[#00f5a0]/5'
                    : 'border-[#1a2e44] bg-[#0b1520] hover:border-[#2a4a64]'
                  }`}
              >
                {/* URL */}
                <p className="text-sm font-bold text-white truncate mb-2">
                  {report.url}
                </p>

                {/* Date and count */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#4a6a80]">
                    {report.date}
                  </span>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{
                      color: report.vulnerabilities > 0 ? '#ff4560' : '#00f5a0',
                      background: report.vulnerabilities > 0 ? 'rgba(255,69,96,0.1)' : 'rgba(0,245,160,0.1)'
                    }}>
                    {report.vulnerabilities} vulnerabilities
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Report Detail */}
        <div className="flex-1">
          {!selected ? (
            <div className="rounded-xl border border-[#1a2e44] bg-[#0b1520] h-full flex flex-col items-center justify-center gap-3 p-8">
              <FileText size={32} className="text-[#1a2e44]" />
              <p className="font-mono text-[11px] text-[#4a6a80]">Select a report to view details</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">

              {/* Summary Cards */}
              {selected.summary && (
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Total', count: selected.summary.total_vulnerabilities, color: '#00f5a0' },
                    { label: 'Critical', count: selected.summary.severity_counts?.critical || 0, color: '#ff4560' },
                    { label: 'High', count: selected.summary.severity_counts?.high || 0, color: '#f5a623' },
                    { label: 'Medium', count: selected.summary.severity_counts?.medium || 0, color: '#7b61ff' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-[#1a2e44] bg-[#0b1520] p-4">
                      <p className="font-mono text-[10px] tracking-widest uppercase mb-2"
                        style={{ color: stat.color }}>{stat.label}</p>
                      <p className="text-3xl font-extrabold"
                        style={{ color: stat.color }}>{stat.count}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Findings Table */}
              <div className="rounded-xl border border-[#1a2e44] bg-[#0b1520] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#1a2e44]">
                  <h2 className="text-sm font-bold text-white">Findings</h2>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1a2e44]">
                      <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Title</th>
                      <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Severity</th>
                      <th className="text-left font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase px-5 py-3">Validated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.findings?.map((finding, i) => (
                      <tr key={i} className="border-b border-[#1a2e44] hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3 text-sm text-[#c8dce8]">{finding.title}</td>
                        <td className="px-5 py-3">
                          <span className="text-[10px] font-mono font-bold px-2 py-1 rounded"
                            style={{
                              color: finding.severity === 'critical' ? '#ff4560' : finding.severity === 'high' ? '#f5a623' : '#7b61ff',
                              background: finding.severity === 'critical' ? 'rgba(255,69,96,0.1)' : finding.severity === 'high' ? 'rgba(245,166,35,0.1)' : 'rgba(123,97,255,0.1)'
                            }}>
                            {finding.severity?.toUpperCase()}
                          </span>
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
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default ReportsPage