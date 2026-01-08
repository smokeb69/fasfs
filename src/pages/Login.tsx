import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">BLOOMCRAWLER RIIS</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center mb-6">Sign in to continue</p>
          <Button className="w-full">Sign In with Manus OAuth</Button>
        </CardContent>
      </Card>
    </div>
  );
}
