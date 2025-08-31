import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserCheck, 
  UserX,
  Shield,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  Search,
  Filter,
  Download,
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { sendUserStatusUpdate } from '@/lib/emailService';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Fetch all users from user_registrations table (includes pending, approved, rejected)
  const { data: registrations, isLoading, error } = useQuery({
    queryKey: ['user-registrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Approve user mutation
  const approveMutation = useMutation({
    mutationFn: async ({ registrationId, notes }: { registrationId: string; notes: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update the registration status
      const { error: updateError } = await supabase
        .from('user_registrations')
        .update({
          status: 'approved',
          admin_notes: notes,
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (updateError) throw updateError;

      // Note: User account creation in auth.users will be handled via Supabase Edge Function
      // or the user will create their own account after approval

      // Send approval email to user
      try {
        await sendUserStatusUpdate({
          name: selectedRegistration.full_name,
          email: selectedRegistration.email,
          status: 'approved',
          reason: notes,
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
        await sendUserStatusUpdate({
          name: selectedRegistration.full_name,
          email: selectedRegistration.email,
          status: 'rejected',
          reason: notes,
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

  // Filter registrations based on search and status
  const filteredRegistrations = registrations?.filter(registration => {
    const matchesSearch = !searchTerm || 
      registration.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const pendingCount = registrations?.filter(r => r.status === 'pending').length || 0;
  const approvedCount = registrations?.filter(r => r.status === 'approved').length || 0;
  const rejectedCount = registrations?.filter(r => r.status === 'rejected').length || 0;
  const totalCount = registrations?.length || 0;

  // Calculate registration trends (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentRegistrations = registrations?.filter(r => 
    new Date(r.created_at) >= thirtyDaysAgo
  ).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">User Registration Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Activity className="w-4 h-4 mr-1" />
                {totalCount} Total Users
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Registration Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Registrations</p>
                    <p className="text-3xl font-bold text-blue-900">{totalCount}</p>
                    <p className="text-xs text-blue-600 mt-1">All time</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-amber-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-700">Pending Review</p>
                    <p className="text-3xl font-bold text-amber-900">{pendingCount}</p>
                    <p className="text-xs text-amber-600 mt-1">Awaiting action</p>
                  </div>
                  <Clock className="w-10 h-10 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Approved</p>
                    <p className="text-3xl font-bold text-green-900">{approvedCount}</p>
                    <p className="text-xs text-green-600 mt-1">Active users</p>
                  </div>
                  <UserCheck className="w-10 h-10 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-pink-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Rejected</p>
                    <p className="text-3xl font-bold text-red-900">{rejectedCount}</p>
                    <p className="text-xs text-red-600 mt-1">Declined access</p>
                  </div>
                  <UserX className="w-10 h-10 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All ({totalCount})
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
                size="sm"
              >
                Pending ({pendingCount})
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('approved')}
                size="sm"
              >
                Approved ({approvedCount})
              </Button>
              <Button
                variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('rejected')}
                size="sm"
              >
                Rejected ({rejectedCount})
              </Button>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User List */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Registrations
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {filteredRegistrations.length} of {totalCount}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading registrations...</p>
                  </div>
                ) : filteredRegistrations.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No registrations found</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter' : 'No users have registered yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredRegistrations.map((registration) => (
                      <div
                        key={registration.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          selectedRegistration?.id === registration.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setAdminNotes(registration.admin_notes || '');
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">{registration.full_name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-gray-600">{registration.email}</p>
                            </div>
                            {registration.phone && (
                              <div className="flex items-center gap-2 mt-1">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <p className="text-sm text-gray-600">{registration.phone}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(registration.status)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Registered: {new Date(registration.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                          {registration.approved_at && (
                            <span>
                              {registration.status === 'approved' ? 'Approved' : 'Rejected'}: {new Date(registration.approved_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Action Panel */}
          <Card className="border-0 shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRegistration ? (
                <div className="space-y-6">
                  {/* User Details */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      User Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-blue-800 w-16">Name:</span>
                        <span className="text-blue-700">{selectedRegistration.full_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700">{selectedRegistration.email}</span>
                      </div>
                      {selectedRegistration.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-700">{selectedRegistration.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700">
                          {new Date(selectedRegistration.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="font-medium text-blue-800">Status:</span>
                        {getStatusBadge(selectedRegistration.status)}
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Admin Notes
                    </label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add your review notes, reasons for approval/rejection, or any additional comments..."
                      className="min-h-[120px] resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      These notes will be included in the email notification to the user.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  {selectedRegistration.status === 'pending' ? (
                    <div className="space-y-3">
                      <Button
                        onClick={handleApprove}
                        disabled={approveMutation.isPending}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-medium"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {approveMutation.isPending ? 'Approving User...' : 'Approve Registration'}
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={rejectMutation.isPending}
                        variant="destructive"
                        className="w-full py-3 text-base font-medium"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        {rejectMutation.isPending ? 'Rejecting User...' : 'Reject Registration'}
                      </Button>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-lg border-2 ${
                      selectedRegistration.status === 'approved' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {selectedRegistration.status === 'approved' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <p className={`font-semibold ${
                          selectedRegistration.status === 'approved' ? 'text-green-800' : 'text-red-800'
                        }`}>
                          Registration {selectedRegistration.status === 'approved' ? 'Approved' : 'Rejected'}
                        </p>
                      </div>
                      {selectedRegistration.approved_at && (
                        <p className={`text-sm mb-2 ${
                          selectedRegistration.status === 'approved' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          Date: {new Date(selectedRegistration.approved_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                      {selectedRegistration.admin_notes && (
                        <div className={`p-3 rounded border ${
                          selectedRegistration.status === 'approved' 
                            ? 'bg-green-100 border-green-300' 
                            : 'bg-red-100 border-red-300'
                        }`}>
                          <p className={`text-sm ${
                            selectedRegistration.status === 'approved' ? 'text-green-800' : 'text-red-800'
                          }`}>
                            <span className="font-medium">Admin Notes:</span><br />
                            {selectedRegistration.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">Select a User</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Choose a registration from the list to review and take action
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
