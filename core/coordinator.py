from openai import OpenAI
from typing import Dict, List, Any, Optional
import asyncio
import json
import sys
import time

from core.llm import LLMProvider
from core.scanner import Scanner
from agents.agent_factory import create_agent_swarm
from utils.logger import get_logger
from utils.reporter import Reporter


def _emit_progress(progress: int, message: str = ""):
    """Emit a progress marker to stdout for the scan controller to pick up."""
    print(f"PROGRESS: {progress}", flush=True)
    if message:
        activity = {"type": "current_task", "description": message, "agent": "SwarmCoordinator"}
        print(f"ACTIVITY: {json.dumps(activity)}", flush=True)


class SwarmCoordinator:
    """Coordinates the activities of multiple specialized security testing agents operating in a swarm."""
    
    def __init__(self, url: str, model: str, provider: str, scope: str, output_dir: str, config: Dict[str, Any], 
                 openai_api_key: str = None, anthropic_api_key: str = None):
        self.url = url
        self.model = model
        self.provider = provider
        self.scope = scope
        self.output_dir = output_dir
        self.config = config
        self.logger = get_logger()
        
        self.llm_provider = LLMProvider(
            provider=provider, 
            model=model,
            openai_api_key=openai_api_key,
            anthropic_api_key=anthropic_api_key
        )
        self.scanner = Scanner()
        self.reporter = Reporter(output_dir)
        
        # Tracking variables
        self.discovered_urls = set([url])
        self.scanned_urls = set()
        self.vulnerabilities = []
    
    def run(self) -> Dict[str, Any]:
        """Execute the full security testing workflow."""
        self.logger.info(f"Starting security testing of {self.url} with {self.provider} model {self.model}")
        _emit_progress(15, f"Initializing browser and loading {self.url}")
        
        # Initialize Playwright browser
        self.scanner.start()
        _emit_progress(20, "Browser initialized, starting scan")
        
        try:
            # Process target URLs according to scope
            if self.scope in ["domain", "subdomain"]:
                _emit_progress(25, f"Expanding scope to {self.scope}")
                self._expand_scope()
            
            _emit_progress(30, "Discovering and loading target pages")
            
            # Process each URL
            total_urls = len(self.discovered_urls)
            for idx, url in enumerate(self.discovered_urls):
                if url in self.scanned_urls:
                    continue
                
                # Calculate progress: scanning phase goes from 30% to 80%
                scan_progress = 30 + int((idx / max(total_urls, 1)) * 50)
                _emit_progress(scan_progress, f"Scanning URL ({idx+1}/{total_urls}): {url[:60]}...")
                
                self.logger.info(f"Processing URL: {url}")
                
                _emit_progress(scan_progress + 5, f"Loading page: {url[:60]}...")
                results = self._process_url(url)
                self.logger.info(f"Security testing results for {url}: {len(results)} vulnerabilities found")
                
                # Print detailed debug info about the results
                if results:
                    self.logger.highlight(f"Found {len(results)} potential vulnerabilities:")
                    for vidx, vuln in enumerate(results, 1):
                        self.logger.highlight(f"  Vulnerability #{vidx}:")
                        self.logger.info(f"    Type: {vuln.get('vulnerability_type', 'Unknown')}")
                        self.logger.info(f"    Severity: {vuln.get('severity', 'Unknown')}")
                        self.logger.info(f"    Target: {vuln.get('target', 'Unknown')}")
                        self.logger.info(f"    Validated: {vuln.get('validated', False)}")
                        
                        # Emit each vulnerability for the UI
                        vuln_json = json.dumps(vuln, default=str)
                        print(f"VULNERABILITY: {vuln_json}", flush=True)
                else:
                    self.logger.warning(f"No vulnerabilities found for {url}")
                
                self.vulnerabilities.extend(results)
                self.scanned_urls.add(url)
            
            # Debug info about overall vulnerabilities before report generation
            self.logger.highlight(f"Total vulnerabilities found: {len(self.vulnerabilities)}")
            self.logger.info(f"Output directory for report: {self.output_dir}")
            
            _emit_progress(85, "Generating security assessment report")
            print("Generating report", flush=True)
            
            # Generate final report
            if self.vulnerabilities:
                report_path = self.reporter.generate_report(self.vulnerabilities)
                self.logger.info(f"Security testing completed. Report saved to {report_path}")
            else:
                self.logger.warning("No vulnerabilities found - creating empty report")
                report_path = self.reporter.generate_report([])
                self.logger.info(f"Empty report saved to {report_path}")
            
            print("Generated security report successfully", flush=True)
            _emit_progress(95, "Report generated successfully")
            
            result = {
                "urls_discovered": len(self.discovered_urls),
                "urls_scanned": len(self.scanned_urls),
                "vulnerabilities_found": len(self.vulnerabilities),
                "report_path": report_path
            }
            
            _emit_progress(100, "Scan completed")
            return result
        
        finally:
            # Clean up resources
            self.scanner.stop()
    
    def _expand_scope(self) -> None:
        """Expand the scope by discovering additional URLs based on the scope setting."""
        self.logger.info(f"Expanding scope to {self.scope}")
        
        # Create and run discovery agent
        discovery_agent = create_agent_swarm(
            agent_type="discovery",
            llm_provider=self.llm_provider,
            scanner=self.scanner,
            config=self.config
        )
        
        new_urls = discovery_agent.discover_urls(
            base_url=self.url, 
            scope=self.scope,
            subdomains=self.scope == "subdomain"
        )
        
        self.discovered_urls.update(new_urls)
        self.logger.info(f"Discovered {len(new_urls)} additional URLs")
    
    def _process_url(self, url: str) -> List[Dict[str, Any]]:
        """Process a single URL with the agent swarm."""
        # Load the page
        _emit_progress(35, f"Loading page: {url[:60]}...")
        page = self.scanner.load_page(url)
        if not page:
            self.logger.error(f"Failed to load page: {url}")
            return []
        
        # Extract page information
        _emit_progress(40, "Extracting page structure and forms")
        page_info = self.scanner.extract_page_info(page)
        
        # Create specialized agent swarm
        _emit_progress(45, "Initializing security testing agents")
        
        activity = {
            "type": "planning",
            "description": f"Planning security tests for {url[:60]}...",
            "agent": "PlannerAgent",
            "details": {"url": url}
        }
        print(f"ACTIVITY: {json.dumps(activity)}", flush=True)
        
        agent_swarm = create_agent_swarm(
            agent_type="security",
            llm_provider=self.llm_provider,
            scanner=self.scanner,
            config=self.config
        )
        
        # Run the swarm and collect results
        _emit_progress(50, "Running security tests (XSS, SQLi, CSRF, etc.)")
        
        # Emit action plan
        plan = [
            "Step 1: Analyze page structure and identify input vectors",
            "Step 2: Test for Cross-Site Scripting (XSS) vulnerabilities",
            "Step 3: Test for SQL Injection vulnerabilities",
            "Step 4: Test for Cross-Site Request Forgery (CSRF)",
            "Step 5: Check security headers and configuration",
            "Step 6: Test authentication and session management",
            "Step 7: Generate security assessment report"
        ]
        plan_activity = {
            "type": "action_plan",
            "description": "Security Testing Action Plan",
            "details": {"plan": plan}
        }
        print(f"ACTIVITY: {json.dumps(plan_activity)}", flush=True)
        print(f"ACTION_PLAN: {json.dumps(plan)}", flush=True)
        
        vulnerabilities = agent_swarm.run(url, page, page_info)
        
        _emit_progress(80, f"Completed security tests - found {len(vulnerabilities)} issues")
        
        return vulnerabilities
