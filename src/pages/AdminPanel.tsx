import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Users, Settings, Activity, Shield } from 'lucide-react';
import { trpc } from '@/hooks/useTrpc';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AdminPanel() {
  const { data: stats } = trpc.admin.getSystemStats.useQuery();
  const { data: auditLogs } = trpc.admin.getAllAuditLogs.useQuery({ limit: 50 });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-slate-400">System administration and management</p>
        </div>

        {/* System Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Database className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-2xl">{stats?.totalSignatures.toLocaleString() || 0}</CardTitle>
              <CardDescription className="text-slate-300">Total Signatures</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Shield className="w-8 h-8 text-red-400 mb-2" />
              <CardTitle className="text-2xl">{stats?.totalAlerts.toLocaleString() || 0}</CardTitle>
              <CardDescription className="text-slate-300">Total Alerts</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Activity className="w-8 h-8 text-green-400 mb-2" />
              <CardTitle className="text-2xl">{stats?.totalSeeds.toLocaleString() || 0}</CardTitle>
              <CardDescription className="text-slate-300">Bloom Seeds</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Users className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle className="text-2xl">{stats?.activeSeeds.toLocaleString() || 0}</CardTitle>
              <CardDescription className="text-slate-300">Active Seeds</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="logs" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription className="text-slate-400">
                  System activity and audit trail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {auditLogs && auditLogs.length > 0 ? (
                    auditLogs.map((log: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{log.action}</p>
                            <p className="text-sm text-slate-400">{log.resourceType} - {log.resourceId}</p>
                          </div>
                          <p className="text-sm text-slate-400">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-8">No audit logs</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage users and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>Add New User</Button>
                  <p className="text-slate-400">User management interface would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure system parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">System Uptime</label>
                    <p className="text-slate-300">{stats?.systemUptime || '99.9%'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Backup</label>
                    <p className="text-slate-300">
                      {stats?.lastBackup ? new Date(stats.lastBackup).toLocaleString() : 'Never'}
                    </p>
                  </div>
                  <Button>Update Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Database operations and maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline">Backup Database</Button>
                  <Button variant="outline">Optimize Database</Button>
                  <Button variant="destructive">Clear Cache</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
