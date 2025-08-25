import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserCheck, 
  UserX,
  Shield,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { sendUserApproval, sendUserRejection } from '@/lib/emailService';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch pending registrations
  const { data: registrations, isLoading } = useQuery({
    queryKey: ['user-registrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_registrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Approve user mutation
  const approveMutation = useMutation({
    mutationFn: async ({ registrationId, notes }: { registrationId: string; notes: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_registrations')
        .update({
          status: 'approved',
          admin_notes: notes,
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (error) throw error;

      // Send approval email to user
      try {
        await sendUserApproval({
          name: selectedRegistration.full_name,
          email: selectedRegistration.email
        });
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Don't fail the approval if email fails
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-registrations'] });
      toast.success('User approved successfully');
      setSelectedRegistration(null);
      setAdminNotes('');
    },
    onError: (error) => {
      toast.error('Failed to approve user: ' + error.message);
    }
  });

  // Reject user mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ registrationId, notes }: { registrationId: string; notes: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_registrations')
        .update({
          status: 'rejected',
          admin_notes: notes,
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (error) throw error;

      // Send rejection email to user
      try {
        await sendUserRejection({
          name: selectedRegistration.full_name,
          email: selectedRegistration.email,
          reason: notes
        });
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
        // Don't fail the rejection if email fails
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-registrations'] });
      toast.success('User rejected successfully');
      setSelectedRegistration(null);
      setAdminNotes('');
    },
    onError: (error) => {
      toast.error('Failed to reject user: ' + error.message);
    }
  });

  const handleApprove = () => {
    if (!selectedRegistration) return;
    approveMutation.mutate({
      registrationId: selectedRegistration.id,
      notes: adminNotes
    });
  };

  const handleReject = () => {
    if (!selectedRegistration) return;
    rejectMutation.mutate({
      registrationId: selectedRegistration.id,
      notes: adminNotes
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingCount = registrations?.filter(r => r.status === 'pending').length || 0;
  const approvedCount = registrations?.filter(r => r.status === 'approved').length || 0;
  const rejectedCount = registrations?.filter(r => r.status === 'rejected').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage user registrations and system access</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-800">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Approved</p>
                  <p className="text-2xl font-bold text-green-800">{approvedCount}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-800">{rejectedCount}</p>
                </div>
                <UserX className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registrations List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Registrations */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading registrations...</p>
                </div>
              ) : registrations?.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No registrations found</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {registrations?.map((registration) => (
                    <div
                      key={registration.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedRegistration?.id === registration.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                      onClick={() => {
                        setSelectedRegistration(registration);
                        setAdminNotes(registration.admin_notes || '');
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{registration.full_name}</h3>
                          <p className="text-sm text-gray-600">{registration.email}</p>
                        </div>
                        {getStatusBadge(registration.status)}
                      </div>
                      
                      {registration.phone && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Phone:</span> {registration.phone}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Registered: {new Date(registration.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column - Action Panel */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Action Panel</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRegistration ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Selected User</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Name:</span> {selectedRegistration.full_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {selectedRegistration.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Status:</span> {selectedRegistration.status}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes
                    </label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about this registration..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {selectedRegistration.status === 'pending' && (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleApprove}
                        disabled={approveMutation.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {approveMutation.isPending ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={rejectMutation.isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </div>
                  )}

                  {selectedRegistration.status !== 'pending' && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        This registration has already been {selectedRegistration.status}.
                      </p>
                      {selectedRegistration.admin_notes && (
                        <p className="text-sm text-blue-700 mt-2">
                          <span className="font-medium">Notes:</span> {selectedRegistration.admin_notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a registration to take action</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
