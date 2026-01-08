import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Bell, Key, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LESettings() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">LE Settings</h1>
          <p className="text-slate-400">Law Enforcement agency configuration</p>
        </div>

        <Tabs defaultValue="agency" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="agency">Agency Config</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data">Data Retention</TabsTrigger>
            <TabsTrigger value="integration">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="agency">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Agency Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Agency Name" className="bg-slate-700 border-slate-600" />
                <Input placeholder="Contact Email" className="bg-slate-700 border-slate-600" />
                <Input placeholder="Contact Phone" className="bg-slate-700 border-slate-600" />
                <textarea
                  placeholder="Address"
                  className="w-full h-24 p-3 bg-slate-700 border border-slate-600 rounded-md text-white"
                />
                <Button>Save Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Email notifications for critical alerts</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>SMS notifications for urgent cases</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Daily summary reports</span>
                  </label>
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="API Key" type="password" className="bg-slate-700 border-slate-600" />
                <Input placeholder="Two-Factor Authentication" className="bg-slate-700 border-slate-600" />
                <Button variant="outline">Generate New API Key</Button>
                <Button>Update Security Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Retention Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Alert Retention (days)</label>
                  <Input type="number" defaultValue="90" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Case Retention (days)</label>
                  <Input type="number" defaultValue="365" className="bg-slate-700 border-slate-600" />
                </div>
                <Button>Update Retention Policies</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Integration Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Webhook URL" className="bg-slate-700 border-slate-600" />
                <Input placeholder="API Endpoint" className="bg-slate-700 border-slate-600" />
                <Button>Save Integration</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
