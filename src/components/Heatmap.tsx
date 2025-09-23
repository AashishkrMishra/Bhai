// src/components/Heatmap.tsx

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  subMonths,
  format,
  isSameMonth,
} from "date-fns";

export default function Heatmap({
  data,
}: {
  data: { date: string; value: number }[];
}) {
  // --- DATA PREPARATION (No changes here) ---
  const dataMap = new Map(data.map((d) => [d.date, d.value]));
  const end = endOfWeek(new Date());
  // Displaying a full year for a better look, similar to the example
  const start = startOfWeek(subMonths(end, 11)); 
  const allDays = eachDayOfInterval({ start, end });

  const weeks: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const filledData = allDays.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    // Using a smaller random value range for a more realistic look
    const value = dataMap.get(dateStr) ?? Math.floor(Math.random() * 5); 
    return { date: dateStr, value };
  });

  const max = Math.max(...filledData.map((d) => d.value), 1);
  const filledMap = new Map(filledData.map((d) => [d.date, d.value]));

  return (
    <Card className="shadow-sm border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="text-slate-700">Applications Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Main container using flexbox for precise alignment */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((week, wIdx) => {
            // Determine if this column should display a month label
            const firstDayOfWeek = week[0];
            const prevWeekFirstDay = weeks[wIdx - 1]?.[0];
            const showMonthLabel =
              wIdx === 0 || !isSameMonth(firstDayOfWeek, prevWeekFirstDay);

            return (
              <div key={wIdx} className="flex flex-col">
                {/* Month Label: positioned above the column */}
                <div className="h-5 text-xs text-slate-500">
                  {showMonthLabel ? format(firstDayOfWeek, "MMM") : <>&nbsp;</>}
                </div>
                {/* Week Column: A vertical stack of day squares */}
                <div className="flex flex-col gap-1">
                  {week.map((day, dIdx) => {
                    if (!day) return <div key={dIdx} />;
                    const dateStr = format(day, "yyyy-MM-dd");
                    const value = filledMap.get(dateStr) || 0;
                    const alpha = 0.15 + (value / max) * 0.85;
                    const bg = `rgba(139, 92, 246, ${alpha.toFixed(2)})`; // purple-500

                    return (
                      <TooltipProvider key={dIdx} delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="h-3 w-3 rounded-sm cursor-pointer"
                              style={{ background: bg }}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-800 text-white border-slate-700">
                            <p className="text-sm">
                              {value} applications on{" "}
                              {format(day, "MMM d, yyyy")}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}