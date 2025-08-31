import SEO from '@/components/SEO';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const fetchRegistrations = async () => {
  const { data, error } = await supabase
    .from('user_registrations')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

const AdminRegistrations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: registrations, isLoading, error, isRefetching } = useQuery({
    queryKey: ['pending_registrations'],
    queryFn: fetchRegistrations,
  });

  const approveMutation = useMutation({
    mutationFn: async (registrationId: string) => {
      setProcessingId(registrationId);
      const { error } = await supabase.functions.invoke('approve-user', {
        body: { registration_id: registrationId },
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: 'User Approved', description: 'The user has been successfully approved and notified.' });
      queryClient.invalidateQueries({ queryKey: ['pending_registrations'] });
    },
    onError: (err: Error) => {
      toast({ title: 'Approval Failed', description: err.message, variant: 'destructive' });
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ registrationId, reason }: { registrationId: string; reason: string }) => {
      setProcessingId(registrationId);
      const { error } = await supabase.functions.invoke('reject-user', {
        body: { registration_id: registrationId, reason },
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: 'User Rejected', description: 'The user registration has been rejected.' });
      queryClient.invalidateQueries({ queryKey: ['pending_registrations'] });
    },
    onError: (err: Error) => {
      toast({ title: 'Rejection Failed', description: err.message, variant: 'destructive' });
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason !== null) {
      rejectMutation.mutate({ registrationId: id, reason: reason || 'No reason provided.' });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <SEO
        title="User Registrations • Admin Dashboard"
        description="Manage pending user registrations."
      />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pending User Registrations</h1>
        {(isLoading || isRefetching) && <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>}
      </div>
      
      {isLoading && <p>Loading registrations...</p>}
      {error instanceof Error && <p className="text-red-500">Error: {error.message}</p>}
      
      {registrations && registrations.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No pending registrations found.</p>
        </div>
      )}

      {registrations && registrations.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations.map((reg) => (
                <tr key={reg.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.phone || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(reg.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleApprove(reg.id)} 
                      disabled={processingId === reg.id}
                      className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === reg.id && approveMutation.isPending ? 'Approving...' : 'Approve'}
                    </button>
                    <button 
                      onClick={() => handleReject(reg.id)} 
                      disabled={processingId === reg.id}
                      className="text-red-600 hover:text-red-900 ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === reg.id && rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default AdminRegistrations;
