import React from 'react';

interface MetadataCardProps {
  items: { label: string; value: string | number | null }[];
  title: string;
}

const MetadataCard: React.FC<MetadataCardProps> = ({ items, title }) => {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
      <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
        {items.map((item, i) => (
          <div key={i} className="space-y-1">
            <span className="text-[9px] text-text-secondary uppercase font-bold tracking-tighter">{item.label}</span>
            <p className="text-xs text-white font-medium truncate" title={String(item.value)}>
              {item.value || 'N/A'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetadataCard;
