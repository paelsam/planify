interface MetricCardProps {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

export function MetricCard({ title, value, color, icon }: MetricCardProps) {
  return (
    <div 
      className="border-4 border-black p-6 relative"
      style={{ 
        backgroundColor: color,
        boxShadow: '8px 8px 0px 0px #000000'
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider mb-2">{title}</p>
          <p className="text-5xl font-black">{value}</p>
        </div>
        <div className="text-4xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
