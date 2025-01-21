"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { CompactWeightCard } from "@/components/Weight/WeightCard/Compact";
import { DatasetCard } from "@/components/Dataset/DatasetCard";
import { Weight } from "@/types/Weight";
import { Dataset } from "@/types/Dataset";

export default function UserPage() {
  const params = useParams();
  const username = params?.id as string;

  const [userWeights, setUserWeights] = useState<Weight[]>([]);
  const [userDataset, setUserDataset] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState<boolean>(false);

  // Fetch user's datasets
  const fetchUserDatasets = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${username}/datasets`
      );
      if (!response.ok) throw new Error("Failed to fetch evaluated datasets");
      const data: Dataset[] = await response.json();
      setUserDataset(data);
    } catch (error) {
      console.error("Error fetching datasets:", error);
    }
  }, [username]);

  // Fetch user's weights
  const fetchUserWeights = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${username}/weights`
      );
      if (!response.ok) throw new Error("Failed to fetch weight");
      const data: Weight[] = await response.json();
      setUserWeights(data);
    } catch (error) {
      console.error("Error fetching weights:", error);
    }
  }, [username]);

  // Check if user exists
  const checkUserId = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${username}`
      );
      if (!response.ok) throw new Error("Failed to check username");
      const exists: boolean = await response.json();
      setUserExists(exists);
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // UseEffect to check if user exists
  useEffect(() => {
    if (!username) return;
    setLoading(true);
    checkUserId();
  }, [username, checkUserId]);

  // UseEffect to fetch user's data if user exists
  useEffect(() => {
    if (userExists) {
      fetchUserWeights();
      fetchUserDatasets();
    }
  }, [userExists, fetchUserWeights, fetchUserDatasets]);

  // Loading and error handling
  if (loading) return <p>Loading...</p>;
  if (!userExists) return <p>Username does not exist.</p>;

  // Render user datasets and weights
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">User&apos;s Datasets and Weights</h1>
      <section>
        <h2 className="text-xl font-semibold mb-4">Owned Datasets</h2>
        <div className="space-y-4">
          {userDataset.length > 0 ? (
            userDataset.map((dataset) => (
              <DatasetCard key={dataset.uniqueIdentifier} dataset={dataset} />
            ))
          ) : (
            <p>No datasets available.</p>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Owned Weights</h2>
        <div className="space-y-4">
          {userWeights.length > 0 ? (
            userWeights.map((weight) => (
              <CompactWeightCard
                key={weight.uniqueIdentifier}
                weight={weight}
              />
            ))
          ) : (
            <p>No weights available.</p>
          )}
        </div>
      </section>
    </div>
  );
}
