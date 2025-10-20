'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/copilotkit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.response);
      } else {
        setResponse('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setResponse('Error: Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4">
          MediTech AI Healthcare Agent
        </h1>
        <p className="mt-3 text-xl text-gray-700">
          Your AI-powered assistant for medical analysis and treatment planning.
        </p>

        <div className="mt-8 w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your symptoms or medical concerns:
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., I have a headache and nausea, or I'm 65 and have diabetes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Get Medical Analysis'}
              </button>
            </form>

            {response && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Analysis:</h3>
                <div className="text-gray-700 whitespace-pre-wrap text-left">
                  {response}
                </div>
              </div>
            )}

            <div className="mt-6 text-sm text-gray-500">
              <p><strong>Examples to try:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>"I have a headache and nausea"</li>
                <li>"Chest pain with shortness of breath"</li>
                <li>"Fever and fatigue for 3 days"</li>
                <li>"I'm 65 and have diabetes, what should I watch for?"</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}