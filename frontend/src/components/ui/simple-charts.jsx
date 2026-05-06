const getMax = (data, key) => Math.max(...data.map((item) => item[key]), 1);

export function SimpleLineChart({ data, xKey, yKey, color = "#3b82f6", height = 260 }) {
  const max = getMax(data, yKey);
  const width = 640;
  const padding = 36;
  const points = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - (item[yKey] / max) * (height - padding * 2);
    return { x, y, label: item[xKey], value: item[yKey] };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[300px]">
        {[0, 1, 2, 3].map((line) => {
          const y = padding + line * ((height - padding * 2) / 3);
          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#e5e7eb" />;
        })}
        <polyline fill="none" stroke={color} strokeWidth="3" points={points.map((point) => `${point.x},${point.y}`).join(" ")} />
        <path d={path} fill="none" stroke={color} strokeWidth="3" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="4" fill={color} />
            <text x={point.x} y={height - 10} textAnchor="middle" fontSize="12" fill="#6b7280">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function SimpleBarChart({ data, xKey, yKey, color = "#10b981", height = 260 }) {
  const max = getMax(data, yKey);

  return (
    <div className="flex items-end gap-3 pt-6" style={{ height }}>
      {data.map((item) => (
        <div key={item[xKey]} className="flex-1 h-full flex flex-col justify-end gap-2">
          <div
            className="rounded-t-md min-h-2"
            style={{ height: `${Math.max((item[yKey] / max) * 85, 4)}%`, backgroundColor: color }}
            title={`${item[xKey]}: ${item[yKey]}`}
          />
          <div className="text-xs text-gray-500 text-center">{item[xKey]}</div>
        </div>
      ))}
    </div>
  );
}

export function SimpleDonutChart({ data, colors }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const segments = data.reduce((result, item, index) => {
    const percent = (item.value / total) * 100;
    const offset = index === 0 ? 25 : result[index - 1].offset - result[index - 1].percent;
    return [...result, { item, index, percent, offset }];
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 42 42" className="w-52 h-52">
        {segments.map(({ item, index, percent, offset }) => {
          const dashArray = `${percent} ${100 - percent}`;
          return (
            <circle
              key={item.name}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={colors[index % colors.length]}
              strokeWidth="7"
              strokeDasharray={dashArray}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
