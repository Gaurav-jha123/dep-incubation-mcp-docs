import React from 'react';

interface TopicChipProps {
  topicName: string;
  onClose: () => void;
}

const TopicChip: React.FC<TopicChipProps> = ({ topicName, onClose }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
      <span className="text-sm font-medium">{topicName}</span>
      <button
        onClick={onClose}
        className="flex items-center justify-center w-5 h-5 hover:bg-blue-200 rounded-full transition-colors"
        aria-label={`Remove ${topicName}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default TopicChip;
