"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Weight } from "@/types/Weight";
import { Dataset } from "@/types/Dataset";
import { Evaluation } from "@/types/DatasetEvaluation";
import { EvaluationCard } from "@/components/Dataset/EvaluationCard";
import { DatasetCard } from "@/components/Dataset/DatasetCard";
import { CompactWeightCard } from "@/components/Weight/WeightCard/Compact";
import { Owner } from "@/types/Owner";
import { MultipleChart } from "@/components/Dataset/DatasetEvaluationChart/Multiple";

interface WeightEvaluation {
  weight: Weight;
  evaluation: Evaluation;
}

export default function Page() {
  const params = useParams();
  const dataset_id = params?.id as string;
  if (!dataset_id) return <p>Loading...</p>;
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [weight, setWeight] = useState<Weight | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<WeightEvaluation[]>([]);

  const fetchPerformance = async (weight_id: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/weights/evaluation/${weight_id}/${dataset_id}`
    );
    if (!response.ok) throw new Error("Failed to fetch performance");
    return await response.json();
  };

  const fetchDataset = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dataset/${dataset_id}`
      );
      if (!response.ok) throw new Error("Failed to fetch dataset");
      const data: Dataset = await response.json();
      setDataset(data);
    } catch (error) {
      console.error("Error fetching datasets:", error);
    }
  };
  const fetchWeights = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dataset/${dataset_id}/weights`
      );
      if (!response.ok) throw new Error("Failed to fetch evaluated weights");
      const data: Weight[] = await response.json();
      const weightEvaluations = await Promise.all(
        data.map(async (weight) => {
          const evaluation = await fetchPerformance(
            weight.uniqueIdentifier
          );
          return {
            weight: weight,
            evaluation: evaluation,
          };
        })
      );
      setEvaluation(weightEvaluations);
    } catch (error) {
      console.error("Error fetching evaluated weights:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwner = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dataset/${dataset_id}/user`
      );
      if (!response.ok) throw new Error("Failed to fetch owner");

      const owner: Owner = await response.json();

      setDataset((prevDataset) => {
        if (prevDataset) {
          return {
            ...prevDataset,
            owner: owner.username,
          };
        }
        return prevDataset;
      });
    } catch (error) {
      console.error("Error fetching owner:", error);
    }
  };

  useEffect(() => {
    if (dataset_id) {
      fetchDataset();
      fetchOwner();
      fetchWeights();
    }
  }, [dataset_id]);
  if (loading) return <p>Loading...</p>;
  if (!dataset)
    return <div className="text-center py-4">No dataset data available</div>;

  return (
    <div className="px-6 space-y-4">
      <DatasetCard dataset={dataset} />
      <MultipleChart
        weights={evaluation.map((e) => e.weight)}
        evaluation={evaluation.map((e) => e.evaluation)}
      />
      <div className="space-y-4">
        {evaluation.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <div className="flex space-x-4">
              <div className="flex-1 ">
                <CompactWeightCard weight={item.weight} />
              </div>
              <div className="flex-2">
                <EvaluationCard evaluation={item.evaluation} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
