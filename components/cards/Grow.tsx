import React from 'react';

const Grow = () => {
  return (
    <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-3xl p-8 md:p-12 h-full flex flex-col justify-between border border-green-500/30">
      <div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
          Grow Together
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-lg">
          Develop your skills and expand your horizons with our growth-focused resources and collaborative opportunities.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <span className="px-4 py-2 rounded-full bg-green-900/50 border border-green-500/30 text-green-300 text-sm">
          Skill Development
        </span>
        <span className="px-4 py-2 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-sm">
          Mentorship
        </span>
        <span className="px-4 py-2 rounded-full bg-green-900/50 border border-green-500/30 text-green-300 text-sm">
          Career Advancement
        </span>
      </div>
    </div>
  );
};

export default Grow;
