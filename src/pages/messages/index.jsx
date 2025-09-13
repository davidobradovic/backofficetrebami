import React, { useState, useEffect } from 'react';
import { messagesAPI } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { AppIcon } from '../../components/AppIcon';

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Mock data for development
  const mockMessages = [
    {
      id: 1,
      senderId: 1,
      receiverId: 2,
      senderName: 'Marko Petrović',
      receiverName: 'Ana Nikolić',
      senderType: 'worker',
      receiverType: 'user',
      subject: 'Job completion confirmation',
      content: 'Hello Ana, I have completed the plumbing work at your address. Everything is working perfectly now.',
      isRead: false,
      messageType: 'job_update',
      createdAt: '2024-01-20T14:30:00Z',
      attachments: []
    },
    {
      id: 2,
      senderId: 3,
      receiverId: 1,
      senderName: 'Stefan Jovanović',
      receiverName: 'Marko Petrović',
      senderType: 'worker',
      receiverType: 'worker',
      subject: 'Equipment sharing request',
      content: 'Hi Marko, could I borrow your professional drill for a project this weekend? I can return it on Monday.',
      isRead: true,
      messageType: 'general',
      createdAt: '2024-01-20T10:15:00Z',
      attachments: []
    },
    {
      id: 3,
      senderId: 4,
      receiverId: 2,
      senderName: 'Admin Support',
      receiverName: 'Ana Nikolić',
      senderType: 'admin',
      receiverType: 'user',
      subject: 'Account verification completed',
      content: 'Your account has been successfully verified. You can now access all features of our platform.',
      isRead: true,
      messageType: 'system',
      createdAt: '2024-01-19T16:45:00Z',
      attachments: []
    },
    {
      id: 4,
      senderId: 2,
      receiverId: 1,
      senderName: 'Ana Nikolić',
      receiverName: 'Marko Petrović',
      senderType: 'user',
      receiverType: 'worker',
      subject: 'Thank you for the excellent work',
      content: 'Marko, thank you so much for fixing the leak. The work was done professionally and on time. I will definitely recommend you to others.',
      isRead: false,
      messageType: 'feedback',
      createdAt: '2024-01-20T18:20:00Z',
      attachments: []
    }
  ];

  useEffect(() => {
    fetchMessages();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await messagesAPI.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined
      });
      
      if (response.success) {
        setMessages(response.data);
        setFilteredMessages(response.data);
        setTotalPages(response.pagination.pages);
        setTotalItems(response.pagination.total);
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages(mockMessages);
      setFilteredMessages(mockMessages);
      setTotalPages(1);
      setTotalItems(mockMessages.length);
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filter changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filterMessages = () => {
    let filtered = messages.filter(message => {
      const matchesSearch = 
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.receiverName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'read' && message.isRead) ||
        (statusFilter === 'unread' && !message.isRead);
      
      const matchesType = typeFilter === 'all' ||
        message.messageType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    setFilteredMessages(filtered);
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message.id);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await messagesAPI.markAsRead(messageId);
      setMessages(messages.map(m => m.id === messageId ? { ...m, isRead: true } : m));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
  };

  const handleSendReply = async (replyData) => {
    try {
      await messagesAPI.reply(selectedMessage.id, replyData);
      setShowReplyModal(false);
      setSelectedMessage(null);
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await messagesAPI.delete(messageId);
        setMessages(messages.filter(m => m.id !== messageId));
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('sr-RS');
  };

  const getMessageTypeColor = (type) => {
    const colors = {
      job_update: 'bg-blue-100 text-blue-800',
      general: 'bg-gray-100 text-gray-800',
      system: 'bg-green-100 text-green-800',
      feedback: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Messages List */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Messages</h1>
          
          {/* Filters */}
          <div className="space-y-3">
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              iconName="Search"
            />
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
              </Select>
              <Select
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="job_update">Job Updates</option>
                <option value="general">General</option>
                <option value="system">System</option>
                <option value="feedback">Feedback</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              } ${!message.isRead ? 'bg-blue-25' : ''}`}
              onClick={() => handleViewMessage(message)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className={`font-medium ${!message.isRead ? 'font-semibold' : ''}`}>
                    {message.subject}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {message.senderName} → {message.receiverName}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMessageTypeColor(message.messageType)}`}>
                    {message.messageType.replace('_', ' ')}
                  </span>
                  {!message.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">
                {message.content}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDateTime(message.createdAt)}
              </p>
            </div>
          ))}

          {filteredMessages.length === 0 && !loading && (
            <div className="text-center py-12">
              <AppIcon name="MessageSquare" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      {/* Message Detail */}
      <div className="flex-1 flex flex-col">
        {selectedMessage ? (
          <>
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedMessage.subject}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    From: {selectedMessage.senderName} ({selectedMessage.senderType})
                  </p>
                  <p className="text-sm text-gray-600">
                    To: {selectedMessage.receiverName} ({selectedMessage.receiverType})
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMessageTypeColor(selectedMessage.messageType)}`}>
                    {selectedMessage.messageType.replace('_', ' ')}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReply(selectedMessage)}
                  >
                    Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {formatDateTime(selectedMessage.createdAt)}
              </p>
            </div>

            <div className="flex-1 p-6 bg-white overflow-y-auto">
              <div className="prose max-w-none">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedMessage.content}
                </p>
              </div>

              {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Attachments</h3>
                  <div className="space-y-2">
                    {selectedMessage.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <AppIcon name="Paperclip" className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-900">{attachment.name}</span>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AppIcon name="MessageSquare" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
              <p className="text-gray-600">Choose a message from the list to view its details.</p>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <ReplyModal
          originalMessage={selectedMessage}
          isOpen={showReplyModal}
          onClose={() => setShowReplyModal(false)}
          onSend={handleSendReply}
        />
      )}
    </div>
  );
};

// Reply Modal Component
const ReplyModal = ({ originalMessage, isOpen, onClose, onSend }) => {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    attachments: []
  });

  useEffect(() => {
    if (originalMessage) {
      setFormData({
        subject: `Re: ${originalMessage.subject}`,
        content: '',
        attachments: []
      });
    }
  }, [originalMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Reply to Message</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <AppIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your reply here..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Send Reply
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessagesManagement;