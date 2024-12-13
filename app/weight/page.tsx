"use client";
import { useState, useEffect } from "react";
import { CompactWeightCard } from "@/components/Weight/WeightCard/Compact";
import { Weight } from "@/types/Weight";
import Link from "next/link";

export default function Page() {
  const [weights, setWeights] = useState<Weight[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState<"likes" | "usage" | "">("");

  // Fetch weights data from the backend
  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/weights`
        );
        if (!response.ok) throw new Error("Failed to fetch weights");
        const data: Weight[] = await response.json();
        setWeights(data);
      } catch (error) {
        console.error("Error fetching weights:", error);
      }
    };
    fetchWeights();
  }, []);

  // Filter weights based on search text
  const filteredWeights = weights.filter((weight) =>
    weight.uniqueIdentifier
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // Sort weights based on the selected option
  const sortedWeights = [...filteredWeights].sort((a, b) => {
    if (sortOption === "likes") {
      return b.likes - a.likes; // Descending order
    } else if (sortOption === "usage") {
      return b.usage - a.usage; // Descending order
    }
    return 0; // No sorting
  });

  return (
    <div className="p-4 space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search by identifier"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={sortOption}
          onChange={(e) =>
            setSortOption(e.target.value as "likes" | "usage" | "")
          }
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Sort By</option>
          <option value="likes">Likes</option>
          <option value="usage">Usage</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedWeights.map((weight) => (
          <CompactWeightCard
            key={weight.uniqueIdentifier}
            weight={weight}
          />
        ))}
      </div>
    </div>
  );
}
