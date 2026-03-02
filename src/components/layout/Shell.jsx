import React from 'react'
import Topbar from './TopBar.jsx'
import Sidebar from './SideBar.jsx'



const Shell = ({ children }) => {
  // console.log(children)
  return (
    <div style={styles.shell}>

      {/* Top navigation bar — spans full width */}
      <div style={styles.topbarWrapper}>
        <Topbar />
      </div>

      {/* Below topbar: sidebar + main content side by side */}
      <div style={styles.body}>

        {/* Left sidebar — fixed width */}
        <div style={styles.sidebarWrapper}>
          <Sidebar />
        </div>

        {/* Main content area — takes remaining space */}
        <main style={styles.main}>
          {children}
        </main>

      </div>
    </div>
  )
}

const styles = {
  
  shell: {
    display: 'grid',
    gridTemplateRows: '56px 1fr',
    minHeight: '100vh',
    background: "linear-gradient(180deg, #0B1620 0%, #0F1E2A 60%, #0B1620 100%)",
    color: '#c8dce',
  },
  
  topbarWrapper: {
    gridRow: '1',
    position: 'sticky',
    top: 0,
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    zIndex: 100, 
    borderBottom: '1px solid #1a2e44',
  },

  body: {
    gridRow: '2',
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    minHeight: 'calc(100vh - 56px)',
    color: '#c8dce8',
  }
  ,

  sidebarWrapper: {
    position: 'sticky',
    top: '56px',
    height: 'calc(100vh - 56px)',
    borderRight: '1px solid #1a2e44',  
    overflowY: 'auto',
  },

  main: {
    padding: '8px 16px',
    overflowY: 'auto'
  },
}

export default Shell