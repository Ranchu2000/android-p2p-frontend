"use client";
import { WeightTrace } from "@/components/Weight/WeightTrace";
import { useParams } from "next/navigation";
export default function Page() {
  const params = useParams();
  const weights_id = params?.id as string;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "#34495e", fontFamily: "Arial, sans-serif" }}>
        Weight Historical Trace
      </h1>
      <WeightTrace weightId={weights_id} />
    </div>
  );
}
