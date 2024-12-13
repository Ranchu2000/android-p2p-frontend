import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Dataset } from "@/types/Dataset";
import { Evaluation } from "@/types/DatasetEvaluation";
import { Weight } from "@/types/Weight";
import { useState } from "react";

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

  const data = sortedData.map(({ weight, evaluation }) => ({
    uniqueId: weight.uniqueIdentifier,
    performance: (evaluation[metric] ?? 0) * 100,
  }));

  return (
    <div
      style={{ width: "100%", height: 450 }} // Increased height for legend space
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
        Class Performance Evaluation (
        {metric.charAt(0).toUpperCase() + metric.slice(1)})
      </h2>
      <BarChart
        width={500}
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
            dy: 4,
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
        <Legend />
        <Bar
          dataKey="performance"
          fill="#F97316"
          name={`${metric.charAt(0).toUpperCase() + metric.slice(1)}`}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </div>
  );
}
