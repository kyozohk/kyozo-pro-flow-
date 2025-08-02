import React from 'react';

const Engage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-3xl p-8 md:p-12 h-full flex flex-col justify-between border border-blue-500/30">
      <div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
          Engage Communities
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-lg">
          Connect with vibrant communities that share your passions. Collaborate, learn, and grow together in a supportive environment.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <span className="px-4 py-2 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-sm">
          Group Discussions
        </span>
        <span className="px-4 py-2 rounded-full bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-sm">
          Live Collaborations
        </span>
        <span className="px-4 py-2 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-sm">
          Community Projects
        </span>
      </div>
    </div>
  );
};

export default Engage;
