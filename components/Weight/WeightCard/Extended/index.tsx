import { useEffect, useState } from "react";
import { Weight } from "@/types/Weight";

interface WeightCardProps {
  weight: Weight;
}

export function WeightCard({ weight }: WeightCardProps) {
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
        {weight.is_uploaded && weight.public_link && (
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
