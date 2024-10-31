"use client";
import { useParams } from "next/navigation";
import { WeightCard } from "@/components/Weight/WeightCard/Extended";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  if (!id) return <p>Loading...</p>;
  return (
    <div className="px-6 space-y-4">
      <WeightCard weights_id={id} />
      <div className="flex justify-between">
        <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
          View History
        </button>
        <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
          Share Weights
        </button>
      </div>
      <div className="space-y-2">
        <label className="font-semibold">Dataset:</label>
        <select className="border border-gray-300 rounded-lg py-1 px-2">
          <option value="default">Select dataset</option>
          {/* Add other options here */}
        </select>

        <div className="pt-4">
          <p>
            <strong>Accuracy:</strong>{" "}
            <span className="text-xl font-bold">70%</span>
          </p>
          <p>
            <strong>Precision:</strong>{" "}
            <span className="text-xl font-bold">70%</span>
          </p>
          <p>
            <strong>F1-Score:</strong>{" "}
            <span className="text-xl font-bold">70%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
