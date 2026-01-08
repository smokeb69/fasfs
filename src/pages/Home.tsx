import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Search,
  BarChart3,
  AlertTriangle,
  Image as ImageIcon,
  Network,
  Zap,
  Lock,
  Globe,
  Cpu,
  Activity,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';

export function Home() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentStat, setCurrentStat] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Threats Detected", value: "15,247", color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Active Investigations", value: "847", color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Critical Alerts", value: "23", color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Bloom Seeds Active", value: "156", color: "text-purple-400", bg: "bg-purple-500/10" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(56,189,248,0.05)_25%,rgba(56,189,248,0.05)_50%,transparent_50%,transparent_75%,rgba(56,189,248,0.05)_75%)] bg-[length:20px_20px] animate-pulse" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-500/10 rounded-full blur-xl animate-pulse delay-2000" />

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16">
          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${isAnimating ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-green-400 text-sm font-medium">SYSTEM ACTIVE</span>
          </div>

          {/* Main Title with Animation */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            BLOOMCRAWLER
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-slate-200">
            RIIS
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-2 font-light">
            Recursive Image Intervention System
          </p>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Advanced AI-Generated Content Detection, Analysis & Ethical Intervention Platform
          </p>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Activity className="w-5 h-5 mr-2" />
                Launch Dashboard
              </Button>
            </Link>
            <Link to="/alert-center">
              <Button variant="outline" size="lg" className="border-slate-600 hover:bg-slate-800 hover:border-slate-500">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Threat Center
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setIsAnimating(!isAnimating)}
              className="border-slate-600 hover:bg-slate-800"
            >
              {isAnimating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Shield, label: "Protection", status: "ACTIVE" },
              { icon: Cpu, label: "AI Engine", status: "ONLINE" },
              { icon: Network, label: "Network", status: "SECURE" },
              { icon: Lock, label: "Encryption", status: "ENABLED" }
            ].map((item, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
                <item.icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <div className="text-xs text-slate-400">{item.label}</div>
                <div className="text-sm font-semibold text-green-400">{item.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Capabilities Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-slate-200">Core Capabilities</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "AI Threat Detection",
                description: "Advanced pattern recognition and anomaly detection for AI-generated harmful content",
                color: "text-blue-400",
                bgColor: "bg-blue-500/10",
                borderColor: "border-blue-500/20",
                link: "/intelligent-alerts"
              },
              {
                icon: Search,
                title: "Digital Forensics",
                description: "Comprehensive investigation tools with metadata analysis and evidence preservation",
                color: "text-green-400",
                bgColor: "bg-green-500/10",
                borderColor: "border-green-500/20",
                link: "/investigation-tools"
              },
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                description: "Live monitoring dashboard with predictive analytics and threat intelligence",
                color: "text-purple-400",
                bgColor: "bg-purple-500/10",
                borderColor: "border-purple-500/20",
                link: "/dashboard"
              },
              {
                icon: ImageIcon,
                title: "Image Intelligence",
                description: "Deep learning-powered image analysis and signature detection",
                color: "text-yellow-400",
                bgColor: "bg-yellow-500/10",
                borderColor: "border-yellow-500/20",
                link: "/image-analysis"
              },
              {
                icon: Network,
                title: "Relationship Mapping",
                description: "Graph-based visualization of entity relationships and threat networks",
                color: "text-red-400",
                bgColor: "bg-red-500/10",
                borderColor: "border-red-500/20",
                link: "/relationship-graph"
              },
              {
                icon: Zap,
                title: "Bloom Engine",
                description: "Recursive ethical intervention system with autonomous payload deployment",
                color: "text-cyan-400",
                bgColor: "bg-cyan-500/10",
                borderColor: "border-cyan-500/20",
                link: "/bloom-seed-generator"
              },
              {
                icon: Shield,
                title: "Dark Web Monitor",
                description: "TOR and I2P network crawling with AI-generated content forensics",
                color: "text-red-400",
                bgColor: "bg-red-500/10",
                borderColor: "border-red-500/20",
                link: "/dark-web-monitor"
              }
            ].map((feature, index) => (
              <Card key={index} className={`${feature.bgColor} ${feature.borderColor} border backdrop-blur-sm hover:scale-105 transition-all duration-300 group cursor-pointer`}>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${feature.bgColor} ${feature.color}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-200 group-hover:text-white transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.link}>
                    <Button variant="ghost" className={`w-full ${feature.color} hover:bg-slate-700 group-hover:scale-105 transition-all duration-200`}>
                      Explore Feature
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Statistics Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-slate-200">Live System Statistics</h3>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className={`${stat.bg} border-slate-700 hover:scale-105 transition-all duration-300 backdrop-blur-sm`}>
                <CardHeader className="text-center pb-2">
                  <div className={`text-4xl font-bold mb-2 ${stat.color} ${isAnimating ? 'animate-pulse' : ''}`}>
                    {currentStat === index ? (
                      <span className="animate-bounce">{stat.value}</span>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <CardDescription className="text-slate-400 font-medium">
                    {stat.label}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${stat.color.replace('text-', 'bg-')}`}
                      style={{ width: `${Math.random() * 40 + 60}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Health Overview */}
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-600 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                System Health Overview
              </CardTitle>
              <CardDescription className="text-slate-400">
                Real-time monitoring of all BLOOMCRAWLER RIIS subsystems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-200">AI Engines</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Threat Detection", status: "Active", color: "text-green-400" },
                      { name: "Pattern Recognition", status: "Active", color: "text-green-400" },
                      { name: "Anomaly Analysis", status: "Active", color: "text-green-400" }
                    ].map((engine, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">{engine.name}</span>
                        <span className={`text-sm font-medium ${engine.color}`}>{engine.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-200">Data Processing</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Image Analysis", status: "Online", color: "text-blue-400" },
                      { name: "Metadata Extraction", status: "Online", color: "text-blue-400" },
                      { name: "Signature Matching", status: "Online", color: "text-blue-400" }
                    ].map((process, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">{process.name}</span>
                        <span className={`text-sm font-medium ${process.color}`}>{process.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-200">Network Status</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Crawler Network", status: "Scanning", color: "text-purple-400" },
                      { name: "API Endpoints", status: "Active", color: "text-green-400" },
                      { name: "Database", status: "Connected", color: "text-green-400" }
                    ].map((network, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">{network.name}</span>
                        <span className={`text-sm font-medium ${network.color}`}>{network.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-slate-200">Quick Actions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "New Investigation",
                description: "Start a new case investigation",
                icon: Search,
                link: "/investigation-cases",
                color: "bg-blue-500/10 border-blue-500/20 hover:border-blue-400"
              },
              {
                title: "Image Analysis",
                description: "Analyze suspicious images",
                icon: ImageIcon,
                link: "/image-analysis",
                color: "bg-green-500/10 border-green-500/20 hover:border-green-400"
              },
              {
                title: "Generate Seed",
                description: "Create ethical bloom payload",
                icon: Zap,
                link: "/bloom-seed-generator",
                color: "bg-purple-500/10 border-purple-500/20 hover:border-purple-400"
              },
              {
                title: "Master Control",
                description: "Unified command & control dashboard",
                icon: Shield,
                link: "/master-dashboard",
                color: "bg-red-500/10 border-red-500/20 hover:border-red-400"
              },
              {
                title: "System Monitor",
                description: "View real-time system status",
                icon: Activity,
                link: "/dashboard",
                color: "bg-orange-500/10 border-orange-500/20 hover:border-orange-400"
              },
              {
                title: "Swarm Crawler",
                description: "Multi-threaded distributed crawling",
                icon: Network,
                link: "/swarm-control",
                color: "bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-400"
              }
            ].map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className={`${action.color} border backdrop-blur-sm hover:scale-105 transition-all duration-300 group cursor-pointer h-full`}>
                  <CardHeader className="text-center">
                    <action.icon className="w-8 h-8 mx-auto mb-3 text-slate-300 group-hover:text-white transition-colors" />
                    <CardTitle className="text-lg text-slate-200 group-hover:text-white transition-colors">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-slate-600 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-slate-200">Our Mission</h3>
              <p className="text-lg text-slate-400 leading-relaxed max-w-4xl mx-auto">
                BLOOMCRAWLER RIIS represents the forefront of ethical AI intervention technology.
                We combine advanced machine learning, digital forensics, and recursive ethical frameworks
                to detect, analyze, and neutralize harmful AI-generated content while protecting individual
                privacy and maintaining the integrity of digital ecosystems.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Law Enforcement Grade</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">Military Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Global Coverage</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
