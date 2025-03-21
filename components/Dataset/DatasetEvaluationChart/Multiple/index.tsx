import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Evaluation } from "@/types/DatasetEvaluation";
import { Weight } from "@/types/Weight";
import { useEffect, useState } from "react";

interface PerformanceChartProps {
  weights: Weight[];
  evaluation: Evaluation[];
}

export function MultipleChart({ weights, evaluation }: PerformanceChartProps) {
  const [metric, setMetric] = useState<"accuracy" | "precision">("accuracy");
  const sortedData = weights
    .map((weight, index) => ({ weight, evaluation: evaluation[index] }))
    .sort(
      (a, b) =>
        new Date(a.weight.last_trained).getTime() -
        new Date(b.weight.last_trained).getTime()
    );

  const [chartWidth, setChartWidth] = useState(500);

  useEffect(() => {
    const updateWidth = () => {
      setChartWidth(window.innerWidth > 600 ? 500 : window.innerWidth - 80);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const data = sortedData.map(({ weight, evaluation }) => ({
    uniqueId: weight.uniqueIdentifier.slice(0, 8),
    performance: (evaluation[metric] ?? 0) * 100,
  }));

  return (
    <div
      style={{ width: "100%", height: 450 }}
      className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg border border-gray-200"
    >
      <div className="flex justify-center mb-4">
        <label className="mr-2">Select Metric:</label>
        <select
          value={metric}
          onChange={(e) =>
            setMetric(e.target.value as "accuracy" | "precision")
          }
          className="border p-1 rounded"
        >
          <option value="accuracy">Accuracy</option>
          <option value="precision">Precision</option>
        </select>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        Model Performance
      </h2>
      <ResponsiveContainer width="110%" height={400}>
        <BarChart
          width={chartWidth}
          height={400}
          data={data}
          margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="uniqueId"
            tick={{ fill: "#F97316", fontSize: 12, fontWeight: 500 }}
            label={{
              value: "Dataset Identifier",
              position: "insideBottom",
              dy: 10,
              fill: "#F97316",
              fontSize: 14,
              fontWeight: 600,
            }}
          />
          <YAxis
            tick={{ fill: "#F97316", fontSize: 12, fontWeight: 500 }}
            label={{
              value: `${metric.charAt(0).toUpperCase() + metric.slice(1)} (%)`,
              angle: -90,
              position: "insideLeft",
              dx: -10,
              dy: 40,
              fill: "#F97316",
              fontSize: 14,
              fontWeight: 600,
            }}
          />
          <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
          <Bar
            dataKey="performance"
            fill="#F97316"
            name={`${metric.charAt(0).toUpperCase() + metric.slice(1)}`}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
