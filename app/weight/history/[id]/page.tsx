"use client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// Dynamically import WeightTrace with SSR disabled.
const WeightTraceNoSSR = dynamic(() => import("@/components/Weight/WeightTrace"), {
  ssr: false,
});

export default function Page() {
  const params = useParams();
  const weights_id = params?.id as string;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "#34495e", fontFamily: "Arial, sans-serif" }}>
        Weight Historical Trace
      </h1>
      <WeightTraceNoSSR weightId={weights_id} />
    </div>
  );
}
