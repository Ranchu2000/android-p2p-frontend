import { Weight } from "@/types/Weight";
import Link from "next/link";
interface CompactWeightCardProps {
  weight: Weight;
}

export function CompactWeightCard({ weight }: CompactWeightCardProps) {
  return (
    <Link
      key={weight.weight_unique_identifier}
      href={`/weight/${weight.weight_unique_identifier}`}
      className="block hover:bg-gray-100 transition duration-150 ease-in-out rounded-lg h-full"
    >
      <div className="h-fullw-full p-4 bg-white shadow rounded-lg border border-gray-200 space-y-2 h-full">
        <h1 className="text-lg font-semibold">
          {weight.weight_unique_identifier}
        </h1>
        <p>
          <strong>Model Task:</strong> {weight.model_task}
        </p>
        <p>
          <strong>Size:</strong> {weight.weight_size} MB
        </p>
        {weight.likes > 0 && (
          <p>
            <strong>Likes:</strong> {weight.likes}
          </p>
        )}
        {weight.usage > 0 && (
          <p>
            <strong>Usage:</strong> {weight.usage}
          </p>
        )}
      </div>
    </Link>
  );
}
