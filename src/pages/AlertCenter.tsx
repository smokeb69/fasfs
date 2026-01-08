import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Search, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { trpc } from '@/utils/trpc';

interface Alert {
  id: string;
  threatName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  affectedResources: string[];
  recommendedActions: string[];
  timeDetected: Date;
  status?: 'new' | 'investigating' | 'resolved';
}

export function AlertCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());

  // Fetch alerts using tRPC
  const { data: alertsData, refetch: refetchAlerts } = trpc.features.alertCenter.getAlerts.useQuery({
    severity: severityFilter !== 'all' ? severityFilter as any : undefined,
    status: statusFilter !== 'all' ? statusFilter as any : undefined,
    limit: 100,
    offset: 0,
    search: searchTerm || undefined,
  });

  // Mutations
  const updateStatusMutation = trpc.features.alertCenter.updateAlertStatus.useMutation();
  const batchUpdateMutation = trpc.features.alertCenter.batchUpdateStatus.useMutation();

  useEffect(() => {
    if (alertsData) {
      const formattedAlerts = alertsData.map(alert => ({
        ...alert,
        timeDetected: new Date(alert.timeDetected),
        indicators: alert.indicators ? JSON.parse(alert.indicators) : [],
        affectedResources: alert.affectedResources ? JSON.parse(alert.affectedResources) : [],
        recommendedActions: alert.recommendedActions ? JSON.parse(alert.recommendedActions) : [],
      }));
      setAlerts(formattedAlerts);
      setFilteredAlerts(formattedAlerts);
      setLoading(false);
    }
  }, [alertsData]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = async (alertId: string, status: 'new' | 'investigating' | 'resolved') => {
    try {
      await updateStatusMutation.mutateAsync({ alertId, status });
      refetchAlerts();
    } catch (error) {
      console.error('Failed to update alert status:', error);
    }
  };

  const handleBatchStatusUpdate = async (status: 'new' | 'investigating' | 'resolved') => {
    if (selectedAlerts.size === 0) return;

    try {
      await batchUpdateMutation.mutateAsync({
        alertIds: Array.from(selectedAlerts),
        status
      });
      setSelectedAlerts(new Set());
      refetchAlerts();
    } catch (error) {
      console.error('Failed to batch update alerts:', error);
    }
  };

  const toggleAlertSelection = (alertId: string) => {
    const newSelected = new Set(selectedAlerts);
    if (newSelected.has(alertId)) {
      newSelected.delete(alertId);
    } else {
      newSelected.add(alertId);
    }
    setSelectedAlerts(newSelected);
  };

  const selectAllAlerts = () => {
    if (selectedAlerts.size === filteredAlerts.length) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(filteredAlerts.map(alert => alert.id)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Alert Center</h1>
          <p className="text-slate-400">Monitor and manage threat detection alerts</p>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6 bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-64">
                <Label htmlFor="search" className="text-slate-300">Search Alerts</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="search"
                    placeholder="Search by threat name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="min-w-32">
                <Label className="text-slate-300">Severity</Label>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-32">
                <Label className="text-slate-300">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedAlerts.size > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBatchStatusUpdate('investigating')}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Mark Investigating ({selectedAlerts.size})
                  </Button>
                  <Button
                    onClick={() => handleBatchStatusUpdate('resolved')}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Mark Resolved ({selectedAlerts.size})
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-6 text-center">
                <p className="text-slate-400">No alerts found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Select All */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={selectedAlerts.size === filteredAlerts.length && filteredAlerts.length > 0}
                  onChange={selectAllAlerts}
                  className="rounded border-slate-600 bg-slate-800"
                />
                <span className="text-slate-300">Select All ({filteredAlerts.length} alerts)</span>
              </div>

              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedAlerts.has(alert.id)}
                        onChange={() => toggleAlertSelection(alert.id)}
                        className="mt-1 rounded border-slate-600 bg-slate-800"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                              {getSeverityIcon(alert.severity)}
                              <span className="ml-1 capitalize">{alert.severity}</span>
                            </Badge>
                            <h3 className="text-lg font-semibold text-white">{alert.threatName}</h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              {alert.status || 'new'}
                            </Badge>
                            <span className="text-sm text-slate-400">
                              {alert.timeDetected.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-slate-300 mb-2">Indicators</h4>
                            <div className="flex flex-wrap gap-1">
                              {alert.indicators.slice(0, 3).map((indicator, index) => (
                                <Badge key={index} variant="secondary" className="bg-slate-800 text-slate-300 text-xs">
                                  {indicator}
                                </Badge>
                              ))}
                              {alert.indicators.length > 3 && (
                                <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs">
                                  +{alert.indicators.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-slate-300 mb-2">Recommended Actions</h4>
                            <ul className="text-sm text-slate-400 space-y-1">
                              {alert.recommendedActions.slice(0, 2).map((action, index) => (
                                <li key={index}>• {action}</li>
                              ))}
                              {alert.recommendedActions.length > 2 && (
                                <li className="text-slate-500">• +{alert.recommendedActions.length - 2} more actions</li>
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleStatusUpdate(alert.id, 'investigating')}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            disabled={alert.status === 'investigating'}
                          >
                            Start Investigation
                          </Button>
                          <Button
                            onClick={() => handleStatusUpdate(alert.id, 'resolved')}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            disabled={alert.status === 'resolved'}
                          >
                            Mark Resolved
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}