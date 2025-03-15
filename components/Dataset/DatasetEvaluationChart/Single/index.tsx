import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Dataset } from "@/types/Dataset";
import { Evaluation } from "@/types/DatasetEvaluation";
import { useEffect, useState } from "react";

interface PerformanceChartProps {
  dataset: Dataset;
  evaluation: Evaluation;
}

export function SingleChart({ dataset, evaluation }: PerformanceChartProps) {

  const [chartWidth, setChartWidth] = useState(500);

  useEffect(() => {
    const updateWidth = () => {
      setChartWidth(window.innerWidth > 600 ? 500 : window.innerWidth - 80);
    };

    updateWidth(); 
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const data = dataset.class_labels.map((label, index) => ({
    classLabel: label,
    performance: (evaluation.class_performance[index] ?? 0) * 100,
  }));
  return (
    <div
      style={{ width: "100%", maxWidth: "100vw", height: "auto" }}
      className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg border border-gray-200"
    >
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        Class Performance
      </h2>

      <ResponsiveContainer width="110%" height={400}>
        <BarChart
          width={chartWidth}
          height={400}
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="classLabel"
            tick={{ fill: "#F97316", fontSize: 12, fontWeight: 500 }}
            label={{
              value: "Class Labels",
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
              value: "Performance (%)",
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
            name="Class Performance"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
