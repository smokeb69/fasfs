import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AuthDebug() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <Card className="max-w-2xl mx-auto bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Auth Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-slate-900 p-4 rounded overflow-auto">
            {JSON.stringify({ user, isAuthenticated }, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
