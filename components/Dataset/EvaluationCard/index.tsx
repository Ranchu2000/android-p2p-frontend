import { Evaluation } from "@/types/DatasetEvaluation";

interface EvaluationCardProps {
  evaluation: Evaluation;
}
export function EvaluationCard({ evaluation }: EvaluationCardProps) {
  return (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg border border-gray-200 space-y-4">
      <p>
        <strong>Accuracy:</strong>{" "}
        <span className="text-xl font-bold">
          {(evaluation.accuracy * 100).toFixed(2)}%
        </span>
      </p>
      <p>
        <strong>Precision:</strong>{" "}
        <span className="text-xl font-bold">
          {(evaluation.precision * 100).toFixed(2)}%
        </span>
      </p>
      <p>
        <strong>Evaluation Date:</strong>{" "}
        <span className="text-xl font-bold">
          {new Date(evaluation.evaluation_date).toLocaleDateString()}
        </span>
      </p>
    </div>
  );
}
