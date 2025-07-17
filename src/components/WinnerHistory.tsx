import React, { useState } from 'react';
import { Trophy, Calendar, User, Building, UserCheck, Trash2, AlertTriangle, X, Filter, Users, Star, MessageCircle, Eye, EyeOff } from 'lucide-react';
import { Winner, ADMIN_PASSWORD, DEPARTMENTS } from '../config/data';

interface WinnerHistoryProps {
  winners: Winner[];
  onDeleteWinner?: (winnerId: string) => void;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  winnerName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, winnerName }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onConfirm();
      setPassword('');
      setError('');
    } else {
      setError('Invalid password. Access denied.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 bg-opacity-20 rounded-xl backdrop-blur-sm">
              <AlertTriangle className="w-8 h-8 text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-white">Delete Winner</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors bg-white bg-opacity-10 rounded-full p-2 hover:bg-opacity-20 backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-white text-opacity-90 mb-4">
            Are you sure you want to delete <span className="font-semibold text-purple-200">{winnerName}</span> from the winners list? This action cannot be undone.
          </p>
          
          <form onSubmit={handleSubmit}>
            <label htmlFor="delete-password" className="block text-sm font-medium text-white text-opacity-90 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              id="delete-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent text-white placeholder-white placeholder-opacity-60 backdrop-blur-sm"
              placeholder="Enter admin password"
            />
            
            {error && (
              <div className="mt-3 p-3 bg-red-500 bg-opacity-20 border border-red-400 border-opacity-50 text-red-200 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-white bg-opacity-10 border border-white border-opacity-20 text-white rounded-xl hover:bg-opacity-20 transition-colors backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-red-600 bg-opacity-80 text-white rounded-xl hover:bg-opacity-90 transition-colors backdrop-blur-sm border border-red-500 border-opacity-50"
              >
                Delete Winner
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const WinnerHistory: React.FC<WinnerHistoryProps> = ({ winners, onDeleteWinner }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [expandedWinner, setExpandedWinner] = useState<string | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    winnerId: string | null;
    winnerName: string;
  }>({
    isOpen: false,
    winnerId: null,
    winnerName: ''
  });

  const handleDeleteClick = (winner: Winner) => {
    setDeleteModalState({
      isOpen: true,
      winnerId: winner.id || '',
      winnerName: winner.name
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModalState.winnerId && onDeleteWinner) {
      onDeleteWinner(deleteModalState.winnerId);
    }
    setDeleteModalState({
      isOpen: false,
      winnerId: null,
      winnerName: ''
    });
  };

  const handleDeleteModalClose = () => {
    setDeleteModalState({
      isOpen: false,
      winnerId: null,
      winnerName: ''
    });
  };

  const toggleWinnerExpansion = (winnerId: string) => {
    setExpandedWinner(expandedWinner === winnerId ? null : winnerId);
  };

  // Filter winners based on selected department
  const filteredWinners = selectedDepartment === 'All' 
    ? winners 
    : winners.filter(winner => winner.department === selectedDepartment);

  // Get department counts for display
  const departmentCounts = DEPARTMENTS.reduce((acc, dept) => {
    acc[dept] = winners.filter(winner => winner.department === dept).length;
    return acc;
  }, {} as Record<string, number>);

  // Department button colors
  const getDepartmentColor = (department: string, index: number) => {
    const colors = [
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-violet-400 to-violet-600',
      'from-fuchsia-400 to-fuchsia-600',
      'from-purple-500 to-indigo-600',
      'from-pink-500 to-purple-600',
      'from-indigo-500 to-purple-600',
      'from-violet-500 to-purple-600',
      'from-fuchsia-500 to-pink-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 bg-opacity-30 rounded-full mb-4 backdrop-blur-sm">
            <Trophy className="w-8 h-8 text-yellow-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🏆 Winner History
          </h1>
          <p className="text-xl text-purple-200">
            {winners.length} {winners.length === 1 ? 'Winner' : 'Winners'} Selected So Far
          </p>
        </div>

        {/* Department Filter Buttons */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Filter className="w-6 h-6" />
              Filter by Department
            </h2>
            <p className="text-purple-200">Click on a department to filter winners</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {/* All Button */}
            <button
              onClick={() => setSelectedDepartment('All')}
              className={`group relative overflow-hidden rounded-2xl px-6 py-3 transition-all duration-300 transform hover:scale-105 ${
                selectedDepartment === 'All'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-2xl scale-105'
                  : 'bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20'
              }`}
            >
              <div className="relative z-10 flex items-center gap-2">
                <Star className={`w-5 h-5 ${selectedDepartment === 'All' ? 'text-white' : 'text-yellow-300'}`} />
                <span className={`font-semibold ${selectedDepartment === 'All' ? 'text-white' : 'text-white'}`}>
                  All Departments
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  selectedDepartment === 'All' 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'bg-yellow-500 bg-opacity-30 text-yellow-200'
                }`}>
                  {winners.length}
                </span>
              </div>
              
              {/* Animated background effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                selectedDepartment === 'All' ? 'opacity-30' : ''
              }`} />
            </button>

            {/* Department Buttons */}
            {DEPARTMENTS.map((department, index) => {
              const count = departmentCounts[department] || 0;
              const isSelected = selectedDepartment === department;
              const colorClass = getDepartmentColor(department, index);
              
              return (
                <button
                  key={department}
                  onClick={() => setSelectedDepartment(department)}
                  className={`group relative overflow-hidden rounded-2xl px-6 py-3 transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? `bg-gradient-to-r ${colorClass} shadow-2xl scale-105`
                      : 'bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20'
                  }`}
                >
                  <div className="relative z-10 flex items-center gap-2">
                    <Building className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-purple-300'}`} />
                    <span className={`font-semibold ${isSelected ? 'text-white' : 'text-white'}`}>
                      {department}
                    </span>
                    {count > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        isSelected 
                          ? 'bg-white bg-opacity-20 text-white' 
                          : 'bg-purple-500 bg-opacity-30 text-purple-200'
                      }`}>
                        {count}
                      </span>
                    )}
                  </div>
                  
                  {/* Animated background effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                    isSelected ? 'opacity-30' : ''
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Filter Status */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-full backdrop-blur-sm">
              <Users className="w-4 h-4" />
              <span className="font-medium">
                Showing {filteredWinners.length} {filteredWinners.length === 1 ? 'winner' : 'winners'}
                {selectedDepartment !== 'All' && ` from ${selectedDepartment}`}
              </span>
            </div>
          </div>
        </div>

        {/* Winners List */}
        {filteredWinners.length === 0 ? (
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-12 text-center border border-white border-opacity-20">
            <Trophy className="w-16 h-16 text-white opacity-50 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              {selectedDepartment === 'All' ? 'No Winners Yet' : `No Winners from ${selectedDepartment}`}
            </h2>
            <p className="text-purple-200">
              {selectedDepartment === 'All' 
                ? 'Start selecting guides to see winners here!' 
                : `No guides from ${selectedDepartment} have been selected as winners yet.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredWinners.map((winner, index) => (
              <div
                key={`${winner.id}-${winner.timestamp}`}
                className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-xl transform transition-all hover:scale-105 border border-white border-opacity-20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-500 bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-yellow-200 font-bold text-lg">
                        #{selectedDepartment === 'All' 
                          ? winners.findIndex(w => w.id === winner.id) + 1
                          : index + 1
                        }
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{winner.name}</h3>
                      <div className="flex items-center gap-2 text-purple-200">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(winner.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    {winner.chat_ids && winner.chat_ids.length > 0 && (
                      <button
                        onClick={() => toggleWinnerExpansion(winner.id || '')}
                        className="p-2 bg-purple-500 bg-opacity-20 text-purple-300 rounded-lg hover:bg-purple-500 hover:text-white transition-all"
                        title="View Chat IDs"
                      >
                        {expandedWinner === winner.id ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    )}
                    {onDeleteWinner && (
                      <button
                        onClick={() => handleDeleteClick(winner)}
                        className="p-2 bg-red-500 bg-opacity-20 text-red-300 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        title="Delete this winner"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <Building className="w-5 h-5 text-purple-300" />
                    <div>
                      <div className="font-medium text-purple-200">Department</div>
                      <div className="text-lg text-white">{winner.department}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <UserCheck className="w-5 h-5 text-green-300" />
                    <div>
                      <div className="font-medium text-purple-200">Supervisor</div>
                      <div className="text-lg text-white">{winner.supervisor}</div>
                    </div>
                  </div>
                </div>

                {/* Chat IDs Section */}
                {expandedWinner === winner.id && winner.chat_ids && winner.chat_ids.length > 0 && (
                  <div className="mt-4 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-5 h-5 text-purple-300" />
                      <h4 className="font-medium text-purple-200">Chat IDs</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {winner.chat_ids.map((chatId, chatIndex) => (
                        <div key={chatIndex} className="bg-white bg-opacity-10 rounded-lg p-3">
                          <div className="text-xs text-purple-200 mb-1">Chat ID {chatIndex + 1}</div>
                          <div className="text-white font-mono text-sm">{chatId}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <DeleteModal
          isOpen={deleteModalState.isOpen}
          onClose={handleDeleteModalClose}
          onConfirm={handleDeleteConfirm}
          winnerName={deleteModalState.winnerName}
        />
      </div>
    </div>
  );
};

export default WinnerHistory;