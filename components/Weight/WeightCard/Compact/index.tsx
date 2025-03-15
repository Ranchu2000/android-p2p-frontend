import { Weight } from "@/types/Weight";
import Link from "next/link";
interface CompactWeightCardProps {
  weight: Weight;
}

export function CompactWeightCard({ weight }: CompactWeightCardProps) {
  const weightSizeMB = (weight.weight_size / (1024 * 1024)).toFixed(2);
  return (
    <Link
      href={`/weight/${weight.uniqueIdentifier}`}
      className="block hover:bg-gray-100 transition duration-150 ease-in-out rounded-lg h-full"
    >
      <div className="h-fullw-full p-4 bg-white shadow rounded-lg border border-gray-200 space-y-2 h-full">
        <h1 className="text-lg font-semibold">
          Model Name: {weight.uniqueIdentifier}
        </h1>
        <p>
          <strong>Model Task:</strong> {weight.model_task}
        </p>
        <p>
          <strong>Size:</strong> {weightSizeMB} MB
        </p>
        <p>
          <strong>Likes:</strong> {weight.likes}
        </p>
        <p>
          <strong>Usage:</strong> {weight.usage}
        </p>
      </div>
    </Link>
  );
}
