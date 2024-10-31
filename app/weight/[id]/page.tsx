"use client";
import { useParams } from "next/navigation";
import { WeightCard } from "@/components/Weight/WeightCard/Extended";
import { useEffect, useState } from "react";
import { Weight } from "@/types/Weight";
import { Dataset } from "@/types/Dataset";
import { DatasetEvaluation } from "@/types/DatasetEvaluation";
import { EvaluationCard } from "@/components/Dataset/EvaluationCard";
import { DatasetCard } from "@/components/Dataset/DatasetCard";
import { DatasetEvaluationChart } from "@/components/Dataset/DatasetEvaluationChart";

export default function Page() {
  const params = useParams();
  const weights_id = params?.id as string;
  if (!weights_id) return <p>Loading...</p>;
  const [weight, setWeight] = useState<Weight | null>(null);
  const [weightLoading, setWeightLoading] = useState(true);
  const [datasetsLoading, setDatasetsLoading] = useState(true);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [evaluation, setEvaluation] = useState<DatasetEvaluation | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const handleDatasetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const dataset =
      value === "default"
        ? null
        : datasets.find((ds) => ds.uniqueIdentifier === value) || null;
    setSelectedDataset(dataset);
  };

  const fetchDatasets = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/weights/evaluation/${weights_id}`
      );
      if (!response.ok) throw new Error("Failed to fetch evaluated datasets");
      const data: Dataset[] = await response.json();
      setDatasets(data);
    } catch (error) {
      console.error("Error fetching datasets:", error);
    } finally {
      setDatasetsLoading(false);
    }
  };
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
      setWeightLoading(false);
    }
  };

  const fetchPerformance = async (dataset_id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/weights/evaluation/${weights_id}/${dataset_id}`
      );
      if (!response.ok) throw new Error("Failed to fetch performance");
      const data: DatasetEvaluation = await response.json();
      setEvaluation(data);
    } catch (error) {
      console.error("Error fetching performance:", error);
    } finally {
      setEvaluationLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedDataset) {
      setEvaluation(null);
      return;
    }
    fetchPerformance(selectedDataset.uniqueIdentifier);
  }, [selectedDataset]);

  useEffect(() => {
    if (!weights_id) return;
    fetchWeight();
    fetchDatasets();
  }, [weights_id]);

  if (weightLoading || datasetsLoading)
    return <div className="text-center py-4">Loading...</div>;
  if (!weight)
    return <div className="text-center py-4">No weight data available</div>;

  return (
    <div className="px-6 space-y-4">
      <h1 className="text-xl font-bold text-center">Weight Information</h1>
      <WeightCard weight={weight} />
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
        <select
          className="border border-gray-300 rounded-lg py-1 px-2"
          onChange={handleDatasetChange}
        >
          {datasets.length > 0 ? (
            <>
              <option value="default">Select dataset</option>
              {datasets?.map((dataset) => (
                <option
                  key={dataset.uniqueIdentifier}
                  value={dataset.uniqueIdentifier}
                >
                  {dataset.uniqueIdentifier}
                </option>
              ))}
            </>
          ) : (
            <option disabled>No datasets available</option>
          )}
        </select>
        {selectedDataset && evaluation && !evaluationLoading && (
          <div>
            <div className="flex space-x-1">
              <DatasetCard dataset={selectedDataset} />
              <EvaluationCard evaluation={evaluation} />
            </div>
            <DatasetEvaluationChart
              dataset={selectedDataset}
              evaluation={evaluation}
            />
          </div>
        )}
      </div>
    </div>
  );
}
