import { Link, useLocation } from 'react-router-dom';
import {
  Home, LayoutDashboard, Bell, Shield, Image as ImageIcon,
  Search, Network, Settings, UserCog, AlertTriangle,
  Briefcase, FileText, Bot, Database, LineChart, Lock,
  HardDrive, Globe, Cpu, Target
} from 'lucide-react';
import { Button } from './ui/button';

interface MainNavigationProps {
  logout: () => void;
}

export function MainNavigation({ logout }: MainNavigationProps) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/master-dashboard', label: 'Master Dashboard', icon: LayoutDashboard },
    { path: '/attack-vectors', label: 'Attack Vectors', icon: Target },
    { path: '/alerts', label: 'Alert Center', icon: Bell },
    { path: '/intelligent-alerts', label: 'Intelligent Alerts', icon: AlertTriangle },
    { path: '/image-analysis', label: 'Image Analysis', icon: ImageIcon },
    { path: '/investigation-tools', label: 'Investigation Tools', icon: Search },
    { path: '/cases', label: 'Investigation Cases', icon: Briefcase },
    { path: '/entity-extraction', label: 'Entity Extraction', icon: FileText },
    { path: '/relationship-graph', label: 'Relationship Graph', icon: Network },
    { path: '/crawler-control', label: 'Crawler Control', icon: Bot },
    { path: '/bloom-seed-generator', label: 'Bloom Seed Generator', icon: Shield },
    { path: '/bloom-distribution', label: 'Bloom Distribution', icon: Database },
    { path: '/team-operations', label: 'Team Operations', icon: UserCog },
    { path: '/ai-alerts', label: 'AI Alert System', icon: LineChart },
    { path: '/le-settings', label: 'LE Settings', icon: Settings },
    { path: '/admin', label: 'Admin Panel', icon: Settings },
    { path: '/secure-enclave', label: 'Secure Enclave', icon: Lock },
    { path: '/advanced-forensics', label: 'Advanced Forensics', icon: HardDrive },
    { path: '/international-integration', label: 'International Integration', icon: Globe },
    { path: '/quantum-ai', label: 'Quantum AI', icon: Cpu },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white">BLOOMCRAWLER RIIS</h1>
        <p className="text-xs text-slate-400 mt-1">Recursive Image Intervention System</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Button
          variant="outline"
          className="w-full text-white border-slate-700 hover:bg-slate-800"
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
