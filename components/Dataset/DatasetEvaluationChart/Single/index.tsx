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

interface PerformanceChartProps {
  dataset: Dataset;
  evaluation: Evaluation;
}

export function SingleChart({ dataset, evaluation }: PerformanceChartProps) {
  // Prepare data for Recharts, combining class_labels and class_performance
  const data = dataset.class_labels.map((label, index) => ({
    classLabel: label,
    performance: (evaluation.class_performance[index] ?? 0) * 100,
  }));
  return (
    <div
      style={{ width: "100%", height: 400 }}
      className=" flex flex-col items-center p-6 bg-white shadow-lg rounded-lg border border-gray-200"
    >
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        Class Performance
      </h2>
      <BarChart
        width={500}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="classLabel"
          tick={{ fill: "#F97316", fontSize: 12, fontWeight: 500 }}
          label={{
            value: "Class Labels",
            position: "insideBottom",
            dy: 10,
            fill: "#F97316", // Orange axis label
            fontSize: 14,
            fontWeight: 600,
          }}
        />
        <YAxis
          tick={{ fill: "#F97316", fontSize: 12, fontWeight: 500 }}
          label={{
            value: "Performance (%)",
            angle: -90,
            position: "insideLeft",
            dx: -10,
            dy: 40,
            fill: "#F97316", // Orange axis label
            fontSize: 14,
            fontWeight: 600,
          }}
        />
        <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
        {/* <Legend /> */}
        <Bar
          dataKey="performance"
          fill="#F97316"
          name="Class Performance"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </div>
  );
}
