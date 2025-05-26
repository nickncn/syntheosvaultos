"use client";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    CartesianGrid,
} from "recharts";
import type { TooltipProps } from "recharts";

type APYChartProps = {
    data: {
        time: string;
        ekubo: number;
        vesu: number;
    }[];
};

export default function StrategyAPYChart({ data }: APYChartProps) {
    const tooltipFormatter: TooltipProps<number, string>["formatter"] = (value) => {
        if (typeof value === "number") {
            return [`${value.toFixed(2)}%`, "APY"];
        }
        return ["No data", "APY"];
    };

    return (
        <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                    <XAxis dataKey="time" stroke="#ccc" />
                    <YAxis
                        tickFormatter={(val) => `${val}%`}
                        stroke="#ccc"
                        width={60}
                        domain={[4.3, 6.3]}
                    />
                    <Tooltip formatter={tooltipFormatter} labelFormatter={(label) => `Month: ${label}`} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="ekubo"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        dot={{ r: 2.5 }}
                        name="Ekubo"
                    />
                    <Line
                        type="monotone"
                        dataKey="vesu"
                        stroke="#34d399"
                        strokeWidth={2.5}
                        dot={{ r: 2.5 }}
                        name="Vesu"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
