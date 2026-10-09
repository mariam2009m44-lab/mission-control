import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { getMissions } from '../utils/auth';

const COLORS = ['#00ff88', '#ffb800', '#ff3d5a'];

export default function StatisticsPage({ onClose }) {
  const [missions] = useState(() => getMissions());

  const stats = useMemo(() => {
    const success = missions.filter((m) => m.status === 'SUCCESS').length;
    const partial = missions.filter((m) => m.status === 'PARTIAL').length;
    const failed = missions.filter((m) => m.status === 'FAILED').length;

    const scoreTimeline = missions
      .slice()
      .reverse()
      .map((m, i) => ({
        name: `#${i + 1}`,
        score: m.score || 0,
        date: new Date(m.createdAt).toLocaleDateString('en', { day: '2-digit', month: 'short' }),
      }));

    const byObjective = {};
    missions.forEach((m) => {
      byObjective[m.objective] = (byObjective[m.objective] || 0) + 1;
    });
    const objectiveData = Object.entries(byObjective).map(([k, v]) => ({
      name: k.charAt(0).toUpperCase() + k.slice(1),
      count: v,
    }));

    return {
      success, partial, failed,
      scoreTimeline,
      objectiveData,
      total: missions.length,
      pieData: [
        { name: 'Success', value: success },
        { name: 'Partial', value: partial },
        { name: 'Failed', value: failed },
      ].filter((d) => d.value > 0),
    };
  }, [missions]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[80] flex items-start md:items-center justify-center p-2 md:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-space-800/95 border border-white/20 rounded-3xl p-4 md:p-6 max-w-3xl w-full my-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-space-accent">📊 Statistics</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">✕</button>
        </div>

        {stats.total === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No missions yet. Launch your first mission to see stats! 🚀
          </div>
        ) : (
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-space-success/10 border border-space-success/30 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-space-success">{stats.success}</div>
                <div className="text-[10px] text-gray-400">SUCCESS</div>
              </div>
              <div className="bg-space-warning/10 border border-space-warning/30 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-space-warning">{stats.partial}</div>
                <div className="text-[10px] text-gray-400">PARTIAL</div>
              </div>
              <div className="bg-space-danger/10 border border-space-danger/30 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-space-danger">{stats.failed}</div>
                <div className="text-[10px] text-gray-400">FAILED</div>
              </div>
            </div>

            {/* Line Chart - Score Timeline */}
            <div className="bg-white/5 rounded-2xl p-3">
              <h3 className="text-xs font-bold text-space-accent mb-2">📈 Score Timeline</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={stats.scoreTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      background: '#0a0e1aee',
                      border: '1px solid #00d4ff40',
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    dot={{ fill: '#00d4ff', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Status Distribution */}
            <div className="bg-white/5 rounded-2xl p-3">
              <h3 className="text-xs font-bold text-space-accent mb-2">🥧 Status Distribution</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {stats.pieData.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#0a0e1aee',
                      border: '1px solid #00d4ff40',
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Missions by Objective */}
            {stats.objectiveData.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-3">
                <h3 className="text-xs font-bold text-space-accent mb-2">🎯 Missions by Objective</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={stats.objectiveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#888" fontSize={10} />
                    <YAxis stroke="#888" fontSize={10} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#0a0e1aee',
                        border: '1px solid #00d4ff40',
                        borderRadius: 8,
                        fontSize: 11,
                      }}
                    />
                    <Bar dataKey="count" fill="#00d4ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-gradient-to-r from-space-accent to-cyan-400 text-space-900 rounded-xl font-bold text-sm"
        >
          CLOSE
        </button>
      </motion.div>
    </motion.div>
  );
}
