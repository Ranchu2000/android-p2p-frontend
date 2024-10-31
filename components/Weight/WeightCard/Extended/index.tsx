import { useEffect, useState } from "react";
import { Weight } from "@/types/Weight";

interface WeightCardProps {
  weights_id: string;
}

export function WeightCard({ weights_id }: WeightCardProps) {
  const [weight, setWeight] = useState<Weight | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!weights_id) return;

    const fetchWeight = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/weights/${weights_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch weight");
        const data: Weight = await response.json();
        setWeight(data);
      } catch (error) {
        console.error("Error fetching weight:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeight();
  }, [weights_id]);

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (!weight)
    return <div className="text-center py-4">No weight data available</div>;

  return (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg border border-gray-200 space-y-4">
      <h1 className="text-xl font-bold">{weight.weight_unique_identifier}</h1>
      <div>
        <p>
          <strong>Model Task:</strong> {weight.model_task}
        </p>
        <p>
          <strong>Size:</strong> {weight.weight_size} MB
        </p>
        <p>
          <strong>Description:</strong>{" "}
          {weight.description || "No description available"}
        </p>
        <p>
          <strong>Architecture:</strong> {weight.architecture}
        </p>
        <p>
          <strong>Last Trained:</strong>{" "}
          {new Date(weight.last_trained).toLocaleDateString()}
        </p>
        <p>
          <strong>Usage:</strong> {weight.usage}
        </p>
        <p>
          <strong>Likes:</strong> {weight.likes}
        </p>
        {weight.public_link && weight.is_uploaded && (
          <p>
            <strong>Public Link:</strong>{" "}
            <a
              href={weight.public_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Access Here
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
