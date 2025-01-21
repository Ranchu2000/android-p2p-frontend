"use client";

import { useParams, useRouter } from "next/navigation";
import { ExtendedWeightCard } from "@/components/Weight/WeightCard/Extended";
import { useEffect, useState, useCallback } from "react";
import { Weight } from "@/types/Weight";
import { Dataset } from "@/types/Dataset";
import { Owner } from "@/types/Owner";
import { Evaluation } from "@/types/DatasetEvaluation";
import { EvaluationCard } from "@/components/Dataset/EvaluationCard";
import { DatasetCard } from "@/components/Dataset/DatasetCard";
import { SingleChart } from "@/components/Dataset/DatasetEvaluationChart/Single";

export default function Page() {
  const params = useParams();
  const weights_id = params?.id as string;
  const router = useRouter();

  const [weight, setWeight] = useState<Weight | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const [weightLoading, setWeightLoading] = useState(true);
  const [datasetsLoading, setDatasetsLoading] = useState(true);
  const [evaluationLoading, setEvaluationLoading] = useState(false);

  // Fetch weight details
  const fetchWeight = useCallback(async () => {
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
  }, [weights_id]);

  // Fetch datasets related to the weight
  const fetchDatasets = useCallback(async () => {
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
  }, [weights_id]);

  // Fetch owner details for the weight
  const fetchOwner = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/weights/${weights_id}/user`
      );
      if (!response.ok) throw new Error("Failed to fetch owner");
      const owner: Owner = await response.json();
      setWeight((prev) =>
        prev ? { ...prev, creator: owner.username } : null
      );
    } catch (error) {
      console.error("Error fetching owner:", error);
    }
  }, [weights_id]);

  // Fetch performance details for a selected dataset
  const fetchPerformance = useCallback(
    async (dataset_id: string) => {
      try {
        setEvaluationLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/weights/evaluation/${weights_id}/${dataset_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch performance");
        const data: Evaluation = await response.json();
        setEvaluation(data);
      } catch (error) {
        console.error("Error fetching performance:", error);
      } finally {
        setEvaluationLoading(false);
      }
    },
    [weights_id]
  );

  // Fetch data when weight ID changes
  useEffect(() => {
    if (!weights_id) return;
    setWeightLoading(true);
    setDatasetsLoading(true);
    fetchWeight();
    fetchOwner();
    fetchDatasets();
  }, [weights_id, fetchWeight, fetchOwner, fetchDatasets]);

  // Fetch performance when a dataset is selected
  useEffect(() => {
    if (!selectedDataset) {
      setEvaluation(null);
      return;
    }
    fetchPerformance(selectedDataset.uniqueIdentifier);
  }, [selectedDataset, fetchPerformance]);

  // Handle dataset selection
  const handleDatasetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const dataset =
      value === "default"
        ? null
        : datasets.find((ds) => ds.uniqueIdentifier === value) || null;
    setSelectedDataset(dataset);
  };

  // Handle navigation to view history
  const handleViewHistory = () => {
    router.push(`/weight/history/${weights_id}`);
  };

  // Loading state
  if (weightLoading || datasetsLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  // No weight data
  if (!weight) {
    return <div className="text-center py-4">No weight data available</div>;
  }

  return (
    <div className="px-6 space-y-4">
      <h1 className="text-xl font-bold text-center">Weight Information</h1>
      <ExtendedWeightCard weight={weight} />
      <div className="flex justify-between">
        <button
          onClick={handleViewHistory}
          className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
        >
          View History
        </button>
        <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
          Share Weights
        </button>
      </div>
      <div className="space-y-2">
        <label className="font-semibold">Dataset: </label>
        <select
          className="border border-gray-300 rounded-lg py-1 px-2"
          onChange={handleDatasetChange}
        >
          <option value="default">Select a dataset</option>
          {datasets.map((dataset) => (
            <option
              key={dataset.uniqueIdentifier}
              value={dataset.uniqueIdentifier}
            >
              {dataset.uniqueIdentifier}
            </option>
          ))}
        </select>
        {selectedDataset && evaluation && !evaluationLoading && (
          <div>
            <div className="flex space-x-1">
              <DatasetCard dataset={selectedDataset} />
              <EvaluationCard evaluation={evaluation} />
            </div>
            <SingleChart dataset={selectedDataset} evaluation={evaluation} />
          </div>
        )}
      </div>
    </div>
  );
}
