import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users
} from 'lucide-react';
import { trpc } from '@/utils/trpc';

interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'contained' | 'resolved' | 'closed';
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  evidence: number;
  investigators: number;
}

export function InvestigationCases() {
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<InvestigationCase | null>(null);

  // Form state for new case
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    severity: 'medium' as const,
  });

  // Fetch cases using tRPC
  const { data: casesData, refetch: refetchCases } = trpc.features.investigationCases.getCases.useQuery({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    limit: 50,
    offset: 0,
  });

  // Mutations
  const createCaseMutation = trpc.features.investigationCases.createCase.useMutation();
  const updateStatusMutation = trpc.features.investigationCases.updateCaseStatus.useMutation();
  const addEvidenceMutation = trpc.features.investigationCases.addEvidence.useMutation();

  useEffect(() => {
    if (casesData) {
      setCases(casesData);
      setLoading(false);
    }
  }, [casesData]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'investigating': return 'bg-yellow-500';
      case 'contained': return 'bg-purple-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCreateCase = async () => {
    try {
      await createCaseMutation.mutateAsync({
        title: newCase.title,
        description: newCase.description,
        severity: newCase.severity,
      });

      setNewCase({ title: '', description: '', severity: 'medium' });
      setShowCreateDialog(false);
      refetchCases();
    } catch (error) {
      console.error('Failed to create case:', error);
    }
  };

  const handleStatusUpdate = async (caseId: string, status: InvestigationCase['status']) => {
    try {
      await updateStatusMutation.mutateAsync({ caseId, status });
      refetchCases();
    } catch (error) {
      console.error('Failed to update case status:', error);
    }
  };

  const handleAddEvidence = async (caseId: string, evidenceType: string, content: string, description?: string) => {
    try {
      await addEvidenceMutation.mutateAsync({
        caseId,
        evidenceType: evidenceType as any,
        content,
        description,
      });
      refetchCases();
    } catch (error) {
      console.error('Failed to add evidence:', error);
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = !searchTerm ||
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || caseItem.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Investigation Cases</h1>
            <p className="text-slate-400">Manage and track investigation cases</p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                New Case
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Investigation Case</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-slate-300">Case Title</Label>
                  <Input
                    id="title"
                    value={newCase.title}
                    onChange={(e) => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Enter case title..."
                  />
                </div>

                <div>
                  <Label htmlFor="severity" className="text-slate-300">Severity</Label>
                  <Select
                    value={newCase.severity}
                    onValueChange={(value: any) => setNewCase(prev => ({ ...prev, severity: value }))}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-slate-300">Description</Label>
                  <Textarea
                    id="description"
                    value={newCase.description}
                    onChange={(e) => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Describe the investigation case..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCase}
                    disabled={!newCase.title || !newCase.description}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Create Case
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-64">
                <Label htmlFor="search" className="text-slate-300">Search Cases</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="search"
                    placeholder="Search by title, description, or case number..."
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
                    <SelectItem value="contained">Contained</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.length === 0 ? (
            <div className="col-span-full">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6 text-center">
                  <p className="text-slate-400">No cases found matching your criteria.</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredCases.map((caseItem) => (
              <Card key={caseItem.id} className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">{caseItem.title}</CardTitle>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{caseItem.description}</p>
                    </div>
                    <Badge className={`${getSeverityColor(caseItem.severity)} text-white`}>
                      {caseItem.severity}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Case Number:</span>
                      <span className="text-white font-mono">{caseItem.caseNumber}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Status:</span>
                      <Badge className={`${getStatusColor(caseItem.status)} text-white`}>
                        {caseItem.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Created:</span>
                      <span className="text-slate-300">{caseItem.createdAt.toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Evidence:
                      </span>
                      <span className="text-white">{caseItem.evidence}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Investigators:
                      </span>
                      <span className="text-white">{caseItem.investigators}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {caseItem.status === 'new' && (
                        <Button
                          onClick={() => handleStatusUpdate(caseItem.id, 'investigating')}
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Start Investigation
                        </Button>
                      )}

                      {caseItem.status === 'investigating' && (
                        <>
                          <Button
                            onClick={() => handleStatusUpdate(caseItem.id, 'contained')}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                          >
                            Mark Contained
                          </Button>
                          <Button
                            onClick={() => handleStatusUpdate(caseItem.id, 'resolved')}
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Resolve
                          </Button>
                        </>
                      )}

                      {(caseItem.status === 'contained' || caseItem.status === 'resolved') && (
                        <Button
                          onClick={() => handleStatusUpdate(caseItem.id, 'closed')}
                          size="sm"
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                        >
                          Close Case
                        </Button>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-700">
                      <Button
                        onClick={() => setSelectedCase(caseItem)}
                        variant="ghost"
                        size="sm"
                        className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <FolderOpen className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Case Details Dialog */}
        {selectedCase && (
          <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
            <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedCase.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${getSeverityColor(selectedCase.severity)} text-white`}>
                    {selectedCase.severity}
                  </Badge>
                  <Badge className={`${getStatusColor(selectedCase.status)} text-white`}>
                    {selectedCase.status}
                  </Badge>
                  <span className="text-slate-400 text-sm">
                    {selectedCase.caseNumber}
                  </span>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-slate-300">{selectedCase.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Case Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Created:</span>
                        <span>{selectedCase.createdAt.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Updated:</span>
                        <span>{selectedCase.updatedAt.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Evidence Count:</span>
                        <span>{selectedCase.evidence}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Investigators:</span>
                        <span>{selectedCase.investigators}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleAddEvidence(selectedCase.id, 'note', 'New investigation note', 'Investigation update')}
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        Add Evidence
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(selectedCase.id, 'investigating')}
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        Start Investigation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}