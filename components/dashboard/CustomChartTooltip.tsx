import React from 'react';

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null || isNaN(value)) return 'N/D';
  return `€ ${value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const CustomChartTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="p-3 bg-white/90 backdrop-blur-sm rounded-lg border border-[#f3e7e8] shadow-md">
        <p className="text-sm font-semibold text-[#1b0e0e]">{`${data.name}`}</p>
        <p className="text-sm text-[#ea2832]">{formatCurrency(data.value)}</p>
      </div>
    );
  }
  return null;
};