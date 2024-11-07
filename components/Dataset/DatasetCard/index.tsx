import { Dataset } from "@/types/Dataset";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface DatasetCardProps {
  dataset: Dataset;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  const router = useRouter();
  if (!dataset)
    return <div className="text-center py-4">No dataset data available</div>;

  return (
    <div
      onClick={() => router.push(`/dataset/${dataset.uniqueIdentifier}`)}
      className="w-full p-6 bg-white shadow-lg rounded-lg border border-gray-200 space-y-4 hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer"
    >
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
          <div>
            <strong>Owner: </strong>
            <Link href={`/user/${dataset.owner}`}>
              <span className="text-blue-500 hover:underline cursor-pointer">
                {dataset.owner}
              </span>
            </Link>
          </div>
        )}
        {/* {dataset.is_public && dataset.public_link && (
            <p>
              <strong>Public Link:</strong>{" "}
              <Link
                href={dataset.public_link}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                Access Here
              </Link>
            </p>
          )} */}
        {dataset.class_labels && dataset.class_labels.length > 0 && (
          <p>
            <strong>Class Labels:</strong> {dataset.class_labels.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
