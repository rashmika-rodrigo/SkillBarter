import { useEffect, useState } from 'react';
import { Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext'; 

// Define the Swap Type based on Django response
interface Swap {
  id: number;
  requester_info: { username: string };
  provider_info: { username: string };
  skill_title: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  created_at: string;
}

const InboxPage = () => {
  const { user, refreshUser } = useAuth(); 
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all swaps
  const fetchSwaps = async () => {
    try {
      const response = await api.get('swaps/');
      setSwaps(response.data);
    } catch (error) {
      console.error("Error fetching swaps", error);
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    fetchSwaps();
  }, []);

  // Handle Accept/Reject Actions
  const handleAction = async (id: number, newStatus: 'ACCEPTED' | 'REJECTED') => {
    try {
      await api.patch(`swaps/${id}/`, { status: newStatus });
      
      // Refresh the list to show the new badge
      await fetchSwaps(); 

      // If Accepted, refresh the Wallet!
      if (newStatus === 'ACCEPTED') {
         await refreshUser();
      }

    } catch (error: any) {
      // Check if the backend sent a specific error message
      if (error.response?.data && Array.isArray(error.response.data)) {
        alert(error.response.data[0]); // "Requester does not have enough Karma credits!"
      } else {
        alert("Failed to update status");
      }
    }
  };

  if (!user) return null;

  // Filter client-side
  const incoming = swaps.filter(s => s.provider_info.username === user.username);
  const sent = swaps.filter(s => s.requester_info.username === user.username);
  

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text flex items-center gap-3">
          <Mail className="text-primary" /> Inbox
        </h1>
        <p className="text-muted mt-2">Manage your skill exchange requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Incoming Requests (Needs Action) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-text border-b border-white/10 pb-2">
            Incoming Requests
          </h2>
          
          {incoming.length === 0 && <p className="text-muted italic">No incoming requests yet.</p>}

          {incoming.map((swap) => (
            <div key={swap.id} className="bg-surface border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden">
              {/* Status Badge */}
              <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${
                swap.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                swap.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {swap.status}
              </div>

              <div className="mb-3">
                <p className="text-sm text-muted">From: <span className="text-primary font-semibold">{swap.requester_info.username}</span></p>
                <p className="text-sm text-text font-bold mt-1">For: {swap.skill_title}</p>
              </div>
              
              <div className="bg-background/50 p-3 rounded-lg text-sm text-muted italic mb-4 border border-white/5">
                "{swap.message}"
              </div>

              {/* Action Buttons (Only if Pending) */}
              {swap.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAction(swap.id, 'ACCEPTED')}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center gap-2"
                  >
                    <CheckCircle size={16} /> Accept
                  </button>
                  <button 
                    onClick={() => handleAction(swap.id, 'REJECTED')}
                    className="flex-1 bg-surface hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-muted hover:text-red-400 py-2 rounded-lg text-sm font-semibold transition-all flex justify-center gap-2"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Sent Requests (Status Check) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-text border-b border-white/10 pb-2">
            Sent Requests
          </h2>

          {sent.length === 0 && <p className="text-muted italic">You haven't requested anything yet.</p>}

          {sent.map((swap) => (
            <div key={swap.id} className="bg-surface/50 border border-white/5 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-muted">To: <span className="text-text font-semibold">{swap.provider_info.username}</span></p>
                  <p className="text-sm font-bold text-primary">{swap.skill_title}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  swap.status === 'PENDING' ? 'border-yellow-500/50 text-yellow-400' :
                  swap.status === 'ACCEPTED' ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                  'border-red-500/50 text-red-400'
                }`}>
                  {swap.status}
                </span>
              </div>
              <p className="text-xs text-muted mt-2 flex items-center gap-1">
                <Clock size={12} /> {new Date(swap.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default InboxPage;