// src/components/Accordion.jsx
import React from 'react';

const Accordion = ({
  title,
  description,
  isOpen,
  isCompleted,
  onClick,
  onMarkComplete,
  onAskTeacher
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        className={`px-4 py-3 flex justify-between items-center cursor-pointer ${isOpen ? 'bg-blue-50' : 'bg-white'
          }`}
        onClick={onClick}
      >
        <div className="flex items-center">
          {isCompleted && (
            <span className="mr-3 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>

      {isOpen && (
        <div className="px-4 py-3 bg-white border-t border-gray-200">
          <p className="text-gray-700 mb-4">{description}</p>
          <div className="flex flex-wrap space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkComplete();
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium ${isCompleted
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
            >
              {isCompleted ? 'Batalkan Selesai' : 'Tandai Selesai'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAskTeacher();
              }}
              className="px-4 py-2 bg-purple-100 text-purple-800 rounded-md text-sm font-medium hover:bg-purple-200"
            >
              Tanya Dosen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;