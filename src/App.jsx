import React from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ScanContext from './context/ScanContext.jsx';
import Shell from './components/layout/Shell.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import VulnerabilitiesPage from './pages/VulnerabilitiesPage.jsx'
import ScannerPage from './pages/ScannerPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'


const App = () => {
  return (
    <ScanContext>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<DashboardPage />}/>
            <Route path="/vulnerabilities" element={<VulnerabilitiesPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
          

        </Shell>
      </BrowserRouter>

    </ScanContext>
    
  )
}

export default App