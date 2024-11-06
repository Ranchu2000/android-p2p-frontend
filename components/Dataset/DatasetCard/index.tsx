import { Dataset } from "@/types/Dataset";
interface DatasetCardProps {
  dataset: Dataset;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  if (!dataset)
    return <div className="text-center py-4">No dataset data available</div>;

  return (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg border border-gray-200 space-y-4">
      <h1 className="text-xl font-bold">{dataset.uniqueIdentifier}</h1>
      <div>
        <p>
          <strong>Model Task:</strong> {dataset.model_task}
        </p>
        <p>
          <strong>Last Modified:</strong>{" "}
          {new Date(dataset.last_modified_date).toLocaleDateString()}
        </p>
        {dataset.owner && (
          <p>
            <strong>Owner:</strong> {dataset.owner}
          </p>
        )}
        {dataset.is_public && dataset.public_link && (
          <p>
            <strong>Public Link:</strong>{" "}
            <a
              href={dataset.public_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Access Here
            </a>
          </p>
        )}
        {dataset.class_labels && dataset.class_labels.length > 0 && (
          <p>
            <strong>Class Labels:</strong> {dataset.class_labels.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
