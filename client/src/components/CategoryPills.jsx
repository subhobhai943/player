import React from 'react';

const categories = [
  { id: 'all',        label: 'All' },
  { id: 'hindi',      label: '🎵 Hindi' },
  { id: 'bollywood',  label: '🎬 Bollywood' },
  { id: 'pop',        label: '🎤 Pop' },
  { id: 'romantic',   label: '💕 Romantic' },
  { id: 'party',      label: '🎉 Party' },
  { id: 'lofi',       label: '☁️ Lo-Fi' },
  { id: 'rap',        label: '🎧 Rap' },
  { id: 'classical',  label: '🎻 Classical' },
  { id: 'english',    label: '🌍 English' },
];

const CategoryPills = ({ active, onChange }) => (
  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-6">
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onChange(cat.id)}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
          active === cat.id
            ? 'bg-spotify-green text-black shadow-lg shadow-spotify-green/30 scale-105'
            : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
        }`}
      >
        {cat.label}
      </button>
    ))}
  </div>
);

export default CategoryPills;
