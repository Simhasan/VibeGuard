import React, { useState } from 'react'
import { Settings } from 'lucide-react'

const SettingsPage = () => {
  const [model, setModel] = useState('mistral')
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434')
  const [scope, setScope] = useState('url')
  const [verbose, setVerbose] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('vibeguard_settings', JSON.stringify({
      model, ollamaUrl, scope, verbose
    }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Scan <span className="text-[#00f5a0]">Settings</span>
          </h1>
          <p className="font-mono text-[11px] text-[#4a6a80] mt-1">
            $ vibeguard config --edit
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="font-mono text-[11px] font-bold px-4 py-2 rounded transition-all duration-200"
          style={{
            background: saved ? 'rgba(0,245,160,0.1)' : 'rgba(0,245,160,0.15)',
            color: '#00f5a0',
            border: '1px solid rgba(0,245,160,0.3)'
          }}>
          {saved ? '✓ SAVED' : 'SAVE SETTINGS'}
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-5">

        {/* LLM Configuration */}
        <div className="rounded-xl border border-[#1a2e44] bg-[#0b1520] p-5">
          
          <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-5">
            LLM Configuration
          </p>

          <div className="flex flex-col gap-5">

            {/* Provider — locked to Ollama */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] text-[#c8dce8]">Provider</label>
              <div className="flex items-center gap-2 bg-[#1a2e44] border border-[#1a2e44] rounded-md px-4 py-2 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#00f5a0]"/>
                <span className="font-mono text-[11px] text-[#00f5a0]">Ollama (Local)</span>
                <span className="font-mono text-[9px] text-[#4a6a80] ml-2">LOCKED</span>
              </div>
            </div>

            {/* Model */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] text-[#c8dce8]">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-[#1a2e44] border border-[#1a2e44] text-white font-mono text-[11px] px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00f5a0] w-64"
                placeholder="e.g. mistral, llama3, phi3"
              />
              <p className="font-mono text-[10px] text-[#4a6a80]">
                Make sure this model is pulled in Ollama
              </p>
            </div>

            {/* Ollama URL */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] text-[#c8dce8]">Ollama Server URL</label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                className="bg-[#1a2e44] border border-[#1a2e44] text-white font-mono text-[11px] px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00f5a0] w-64"
                placeholder="http://localhost:11434"
              />
            </div>

          </div>
        </div>

        {/* Scan Configuration */}
        <div className="rounded-xl border border-[#1a2e44] bg-[#0b1520] p-5">

          <p className="font-mono text-[10px] text-[#4a6a80] tracking-widest uppercase mb-5">
            Scan Configuration
          </p>

          <div className="flex flex-col gap-5">

            {/* Scope */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] text-[#c8dce8]">Scan Scope</label>
              <div className="flex gap-2">
                {['url', 'domain', 'subdomain'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
                    className="font-mono text-[11px] px-4 py-2 rounded-md border transition-all duration-200"
                    style={{
                      color: scope === s ? '#00f5a0' : '#4a6a80',
                      borderColor: scope === s ? '#00f5a0' : '#1a2e44',
                      background: scope === s ? 'rgba(0,245,160,0.08)' : 'transparent'
                    }}>
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="font-mono text-[10px] text-[#4a6a80]">
                {scope === 'url' ? 'Scan only the provided URL' :
                scope === 'domain' ? 'Scan all pages on the domain' :
                'Scan domain and all subdomains'}
              </p>
            </div>

            {/* Verbose */}
            <div className="flex items-center justify-between w-64">
              <div>
                <p className="font-mono text-[11px] text-[#c8dce8]">Verbose Logging</p>
                <p className="font-mono text-[10px] text-[#4a6a80]">Show detailed agent output</p>
              </div>
              <button
                onClick={() => setVerbose(!verbose)}
                className="w-10 h-5 rounded-full transition-all duration-200 relative"
                style={{ background: verbose ? '#00f5a0' : '#1a2e44' }}>
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                  style={{ left: verbose ? '22px' : '2px' }}
                />
              </button>
            </div>

          </div>
        </div>

      </div>



    </div>
  )
}

export default SettingsPage