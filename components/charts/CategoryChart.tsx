'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#38bdf8', '#34d399', '#fbbf24'];

interface CategoryData {
  name: string;
  value: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { name: string; value: number } }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 backdrop-blur-xl p-3 shadow-xl">
      <p className="text-xs font-medium text-foreground">{item.name}</p>
      <p className="text-xs text-muted-foreground">${item.value.toFixed(2)}</p>
    </div>
  );
}

interface CategoryChartProps {
  data: CategoryData[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={32}
            outerRadius={50}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 rounded-full bg-border overflow-hidden w-16">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(item.value / total) * 100}%`,
                    background: COLORS[i % COLORS.length],
                  }}
                />
              </div>
              <span className="text-xs font-medium text-foreground w-10 text-right">
                ${item.value.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
        <div className="pt-1 border-t border-border/60 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-xs font-semibold text-foreground">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
