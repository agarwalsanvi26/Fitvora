import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ProgressRecord } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProgressChartsProps {
  records: ProgressRecord[];
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ records }) => {
  const [metric, setMetric] = useState<'weight' | 'calories' | 'duration' | 'steps'>('weight');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  // Filter or scale data according to timeframe
  const displayRecords = [...records];
  const labels = displayRecords.map(r => {
    const parts = r.date.split('-');
    return `${parts[1]}/${parts[2]}`;
  });

  const getDataset = () => {
    switch (metric) {
      case 'weight':
        return {
          label: 'Body Weight (kg)',
          data: displayRecords.map(r => r.weight),
          borderColor: '#596044',
          backgroundColor: 'rgba(89, 96, 68, 0.15)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#596044',
          pointRadius: 5
        };
      case 'calories':
        return {
          label: 'Calories Burned (kcal)',
          data: displayRecords.map(r => r.caloriesBurned || 400),
          borderColor: '#C87555',
          backgroundColor: 'rgba(200, 117, 85, 0.2)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#C87555',
          pointRadius: 5
        };
      case 'duration':
        return {
          label: 'Workout Duration (min)',
          data: displayRecords.map(r => r.workoutMinutes),
          borderColor: '#303528',
          backgroundColor: 'rgba(48, 53, 40, 0.7)',
          borderRadius: 8
        };
      case 'steps':
        return {
          label: 'Daily Step Count',
          data: displayRecords.map(r => r.steps),
          borderColor: '#596044',
          backgroundColor: 'rgba(89, 96, 68, 0.7)',
          borderRadius: 8
        };
    }
  };

  const chartData = {
    labels,
    datasets: [getDataset()]
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '600' },
          color: '#303528'
        }
      },
      tooltip: {
        backgroundColor: '#303528',
        titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: 'bold' },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13 },
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(231, 223, 209, 0.5)' },
        ticks: { font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }, color: '#1E211B' }
      },
      y: {
        grid: { color: 'rgba(231, 223, 209, 0.5)' },
        ticks: { font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }, color: '#1E211B' }
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs">
      {/* Chart Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7DFD1]">
        <div>
          <h3 className="text-xl font-bold font-editorial text-[#303528]">Performance Analytics</h3>
          <p className="text-xs text-gray-500">Track and visualize your physical progression over time.</p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F5F0E7] rounded-2xl border border-[#E7DFD1]">
          {(['weight', 'calories', 'duration', 'steps'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                metric === m
                  ? 'bg-[#596044] text-white shadow-xs'
                  : 'text-[#303528] hover:bg-white/60'
              }`}
            >
              {m === 'duration' ? 'Duration' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Timeframe Filter Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 pb-2">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Range:</span>
        {(['7d', '30d', '90d'] as const).map(tf => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
              timeframe === tf
                ? 'bg-[#303528] text-white'
                : 'bg-[#F5F0E7] text-[#303528] hover:bg-[#E7DFD1]'
            }`}
          >
            {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : '90 Days'}
          </button>
        ))}
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 sm:h-80 w-full pt-2">
        {metric === 'duration' || metric === 'steps' ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};
