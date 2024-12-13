// "use client";
// import { WeightTrace } from "@/components/Weight/WeightTrace";

// export default function Home() {
//   return (
//     <div>
//       <WeightTrace weightId="ae0aa424-1dbb-4f38-abc4-ffcd8482c0e2" />
//     </div>
//   );
// }
"use client";
import dynamic from "next/dynamic";

// Dynamically import WeightTrace with SSR disabled
const WeightTrace = dynamic(() => import("@/components/Weight/WeightTrace"), {
  ssr: false, // Disable server-side rendering
});

export default function Home() {
  return (
    <div>
      <WeightTrace weightId="ae0aa424-1dbb-4f38-abc4-ffcd8482c0e2" />
    </div>
  );
}