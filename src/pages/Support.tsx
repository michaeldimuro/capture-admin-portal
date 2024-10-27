import { useState } from 'react';
import { Search, MessageCircle, Filter, Clock, AlertCircle, Link, Plus, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
    role: 'customer' | 'support' | 'system';
  };
  timestamp: string;
}

interface Note {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  subject: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  category: 'order' | 'technical' | 'billing' | 'other';
  orderId?: string;
  patientId?: string;
  messages: Message[];
  notes: Note[];
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Issue with medication order #1234',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
    },
    status: 'open',
    priority: 'high',
    category: 'order',
    orderId: 'ORD-001',
    patientId: 'PAT-001',
    createdAt: '2024-03-10T10:00:00Z',
    messages: [
      {
        id: 'm1',
        content: 'My order hasn\'t arrived yet. It\'s been 5 days.',
        sender: { name: 'John Doe', role: 'customer' },
        timestamp: '2024-03-10T10:00:00Z',
      },
      {
        id: 'm2',
        content: 'I\'ll look into this right away for you.',
        sender: { name: 'Support Agent', role: 'support' },
        timestamp: '2024-03-10T10:05:00Z',
      },
    ],
    notes: [
      {
        id: 'n1',
        content: 'Shipping delay due to weather conditions',
        author: 'Support Agent',
        timestamp: '2024-03-10T10:06:00Z',
      },
    ],
  },
  {
    id: '2',
    subject: 'Payment processing error',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
    },
    status: 'in_progress',
    priority: 'medium',
    category: 'billing',
    createdAt: '2024-03-09T15:30:00Z',
    messages: [
      {
        id: 'm3',
        content: 'I\'m getting an error when trying to process payment',
        sender: { name: 'Jane Smith', role: 'customer' },
        timestamp: '2024-03-09T15:30:00Z',
      },
    ],
    notes: [],
  },
];

export function Support() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newNote, setNewNote] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;

    const message: Message = {
      id: `m${Date.now()}`,
      content: newMessage,
      sender: { name: 'Support Agent', role: 'support' },
      timestamp: new Date().toISOString(),
    };

    selectedTicket.messages.push(message);
    setNewMessage('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newNote.trim()) return;

    const note: Note = {
      id: `n${Date.now()}`,
      content: newNote,
      author: 'Support Agent',
      timestamp: new Date().toISOString(),
    };

    selectedTicket.notes.push(note);
    setNewNote('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="order">Orders</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={ticket.customer.avatar}
                      alt={ticket.customer.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                      <p className="text-sm text-gray-500">
                        {ticket.customer.name} ({ticket.customer.email})
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ticket.status === 'open'
                            ? 'bg-yellow-100 text-yellow-800'
                            : ticket.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ticket.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : ticket.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Drawer
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title="Ticket Details"
      >
        {selectedTicket && (
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{selectedTicket.subject}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedTicket.status === 'open'
                      ? 'bg-yellow-100 text-yellow-800'
                      : selectedTicket.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedTicket.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : selectedTicket.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedTicket.priority} priority
                  </span>
                </div>
              </div>

              {(selectedTicket.orderId || selectedTicket.patientId) && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">Related Information</h4>
                  <div className="space-y-2">
                    {selectedTicket.orderId && (
                      <button
                        onClick={() => navigate(`/orders/${selectedTicket.orderId}`)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <Link className="h-4 w-4" />
                        <span>View Order #{selectedTicket.orderId}</span>
                      </button>
                    )}
                    {selectedTicket.patientId && (
                      <button
                        onClick={() => navigate(`/patients/${selectedTicket.patientId}`)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <Link className="h-4 w-4" />
                        <span>View Patient Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Internal Notes</h4>
                <div className="space-y-4">
                  {selectedTicket.notes.map((note) => (
                    <div key={note.id} className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {note.author} - {new Date(note.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <form onSubmit={handleAddNote} className="mt-2">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add an internal note..."
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      rows={2}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button type="submit" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Note
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Conversation</h4>
                <div className="space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender.role === 'support' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender.role === 'support'
                            ? 'bg-blue-100'
                            : message.sender.role === 'system'
                            ? 'bg-gray-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.sender.name} - {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="mt-4">
                  <div className="flex items-end space-x-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                      rows={2}
                    />
                    <Button type="submit">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}