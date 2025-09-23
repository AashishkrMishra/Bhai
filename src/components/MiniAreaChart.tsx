import { Card,CardHeader,CardTitle,CardContent } from "./ui/card";
import {
AreaChart,
Area,
XAxis,
YAxis,
Tooltip as ReTooltip,
ResponsiveContainer,
} from "recharts";

function MiniAreaChart({ data }: { data: { name: string; value: number }[] }) {
return (
<Card className="shadow-lg">
<CardHeader>
<CardTitle>Applications Over Time</CardTitle>
</CardHeader>
<CardContent className="h-56">
<ResponsiveContainer width="100%" height="100%">
<AreaChart data={data}>
<defs>
<linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
<stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
</linearGradient>
</defs>
<XAxis dataKey="name" />
<YAxis />
<ReTooltip />
<Area type="monotone" dataKey="value" stroke="#2563eb" fill="url(#colorA)" />
</AreaChart>
</ResponsiveContainer>
</CardContent>
</Card>
);
};

export default MiniAreaChart;