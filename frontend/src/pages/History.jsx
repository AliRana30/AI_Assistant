import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

const History = () => {
  const { history, setHistory } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    let filtered = history || [];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.speechText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.text?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === 'newest') {
      filtered = [...filtered].reverse();
    }

    setFilteredHistory(filtered);
  }, [history, searchTerm, sortOrder]);

  const clearHistory = () => {
    if (window.confirm('Clear all history?')) {
      setHistory([]);
    }
  };

  const deleteItem = (index) => {
    const actualIndex = sortOrder === 'newest' ? history.length - 1 - index : index;
    const newHistory = history.filter((_, i) => i !== actualIndex);
    setHistory(newHistory);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    return new Date(timestamp).toLocaleString();
  };

  const getCommandIcon = (cmd) => {
    const icons = {
      'youtube_search': '🎥',
      'google_search': '🔍',
      'wikipedia_search': '📚',
      'maps_search': '🗺️',
      'open_maps': '🗺️',
      'weather_show': '🌤️',
      'news_update': '📰',
      'translate': '🌐',
      'calculator_open': '🧮',
      'facebook_open': '📘',
      'instagram_open': '📸',
      'play_music': '🎵',
      'currency_convert': '💱',
      'unit_convert': '📏',
      'email_open': '📧',
      'whatsapp_open': '💬',
      'twitter_open': '🐦',
      'x_open': '🐦',
      'linkedin_open': '💼',
      'github_open': '🐙',
      'netflix_open': '🎬',
      'amazon_open': '🛒',
      'tell_joke': '😄',
      'get_date': '📅',
      'get_time': '⏰',
      'general': '💭',
      'greeting': '👋',
      'thanks': '🙏'
    };
    return icons[cmd] || '💭';
  };

  const getCommandLabel = (cmd) => {
    const labels = {
      'youtube_search': 'YouTube Search',
      'google_search': 'Google Search',
      'wikipedia_search': 'Wikipedia',
      'maps_search': 'Maps',
      'open_maps': 'Maps',
      'weather_show': 'Weather',
      'news_update': 'News',
      'translate': 'Translation',
      'calculator_open': 'Calculator',
      'facebook_open': 'Facebook',
      'instagram_open': 'Instagram',
      'play_music': 'Music',
      'currency_convert': 'Currency',
      'unit_convert': 'Unit Converter',
      'email_open': 'Email',
      'whatsapp_open': 'WhatsApp',
      'twitter_open': 'Twitter',
      'x_open': 'X (Twitter)',
      'linkedin_open': 'LinkedIn',
      'github_open': 'GitHub',
      'netflix_open': 'Netflix',
      'amazon_open': 'Amazon',
      'tell_joke': 'Joke',
      'get_date': 'Date',
      'get_time': 'Time',
      'general': 'General',
      'greeting': 'Greeting',
      'thanks': 'Thanks'
    };
    return labels[cmd] || 'General';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">Conversation History</h2>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Clear All
            </button>
          )}
        </div>

        {filteredHistory.length === 0 ? (
          <p className="text-center text-gray-400">No conversation history found.</p>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700 shadow">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span>{getCommandIcon(item.command)}</span>
                    <span className="text-white font-semibold">{getCommandLabel(item.command)}</span>
                  </div>
                  <div className="text-gray-400 text-sm">{formatTime(item.timestamp)}</div>
                </div>
                <div className="mt-3 text-white">
                  <p><strong>You:</strong> {item.speechText || 'N/A'}</p>
                  <p><strong>AI:</strong> {item.text || 'N/A'}</p>
                </div>
                <div className="text-right mt-2">
                  <button
                    onClick={() => deleteItem(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
