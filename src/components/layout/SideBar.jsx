import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ScanLine, 
  ShieldAlert, 
  FileText, 
  Settings 
} from 'lucide-react'

const SideBar = () => {
  return (
    <div className='flex flex-col h-full bg-[#0b1520] border-r border-[#1a2e44]  px-2 py-5 '>

      {/* Section 1 - Overview */}
      <p className="text-[#4a6a80] text-[10px] font-mono tracking-[2px] uppercase px-5 pt-4 pb-2">
        OVERVIEW
      </p>
      <NavLink to = "/dashboard"
        className={ ({isActive}) =>
          `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colorstransition-colors border-l-2 ${
            isActive 
              ? 'text-[#00f5a0] border-[#00f5a0] bg-[#00f5a0]/5' 
              : 'text-[#4a6a80] border-transparent hover:text-[#c8dce8] hover:bg-white/5'
          }`
        
        }>
        <LayoutDashboard size={16} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/scanner"
        className={({ isActive }) => 
            `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors border-l-2 ${
              isActive 
                ? 'text-[#00f5a0] border-[#00f5a0] bg-[#00f5a0]/5' 
                : 'text-[#4a6a80] border-transparent hover:text-[#c8dce8] hover:bg-white/5'
            }`
          }
      >
        <ScanLine size={16} />
        <span>Scan Manager</span>
      </NavLink>

      {/* Section 2 - Detection */}
      <p className="text-[#4a6a80] text-[10px] font-mono tracking-[2px] uppercase px-5 pt-4 pb-2" >DETECTION</p>
      <NavLink to="/vulnerabilities" 
      className={({ isActive }) => 
            `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors border-l-2 ${
              isActive 
                ? 'text-[#00f5a0] border-[#00f5a0] bg-[#00f5a0]/5' 
                : 'text-[#4a6a80] border-transparent hover:text-[#c8dce8] hover:bg-white/5'
            }`
          }
      
      >
        <ShieldAlert size={16} />
        <span>Vulnerabilities</span>
      </NavLink>

      <NavLink to="/reports" 
      className={({ isActive }) => 
            `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors border-l-2 ${
              isActive 
                ? 'text-[#00f5a0] border-[#00f5a0] bg-[#00f5a0]/5' 
                : 'text-[#4a6a80] border-transparent hover:text-[#c8dce8] hover:bg-white/5'
            }`
          }
      
      >
        <FileText size={16} />
        <span>Reports</span>
      </NavLink>

      {/* Section 3 - Config */}
      <p className="text-[#4a6a80] text-[10px] font-mono tracking-[2px] uppercase px-5 pt-4 pb-2" >CONFIG</p>
      <NavLink to="/settings"
      className={({ isActive }) => 
            `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors border-l-2 ${
              isActive 
                ? 'text-[#00f5a0] border-[#00f5a0] bg-[#00f5a0]/5' 
                : 'text-[#4a6a80] border-transparent hover:text-[#c8dce8] hover:bg-white/5'
            }`
          }
      
      >
        <Settings size={16} />
        <span>Settings</span>
      </NavLink>

      <div className='mt-auto px-4 py-3 border-t border-[#1a2e44]'>
          <p className="font-mono text-[10px] text-[#4a6a80] leading-relaxed">
            Engine v2.1.4<br/>
            Model: <span className="text-[#00f5a0]">mistral:latest</span><br/>
            Status: <span className="text-[#00f5a0]">● Online</span>
          </p>

      </div>

    </div>
  )
}

export default SideBar