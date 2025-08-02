import React from 'react';

const Exclusive = () => {
  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 rounded-3xl p-8 md:p-12 h-full flex flex-col justify-between border border-purple-500/30">
      <div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
          Exclusive Content
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-lg">
          Access premium content created by visionary artists and thought leaders. Dive into a world of inspiration and innovation.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <span className="px-4 py-2 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300 text-sm">
          Premium Articles
        </span>
        <span className="px-4 py-2 rounded-full bg-fuchsia-900/50 border border-fuchsia-500/30 text-fuchsia-300 text-sm">
          Exclusive Events
        </span>
        <span className="px-4 py-2 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300 text-sm">
          Creator Workshops
        </span>
      </div>
    </div>
  );
};

export default Exclusive;
