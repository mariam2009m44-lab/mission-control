import { motion } from 'framer-motion';

export default function MetricBar({ label, value, max, unit = '', color = 'accent', icon }) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorMap = {
    accent: 'from-space-accent to-cyan-400',
    warning: 'from-space-warning to-yellow-300',
    danger: 'from-space-danger to-red-400',
    success: 'from-space-success to-green-300',
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-xs">
        <span className="text-gray-400 flex items-center gap-1">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        <span className={`font-mono font-bold text-space-${color}`}>
          {value}{unit}
        </span>
      </div>
      <div className="h-2 bg-space-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full`}
        />
      </div>
    </div>
  );
}
