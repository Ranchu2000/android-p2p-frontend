/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import NeoVis, { NeovisConfig } from "neovis.js";
import { useRouter } from "next/navigation";

interface WeightTreeProps {
  weightId: string;
}

const WeightTrace = ({ weightId }: WeightTreeProps) => {
  const vizRef = useRef<HTMLDivElement>(null);
  const vizInstanceRef = useRef<any>(null);
  const router = useRouter();
  const [recursionDepth, setRecursionDepth] = useState<number>(2);
  const formatUUID = (uuid: string) =>
    uuid.length > 8 ? uuid.substring(0, 8) : uuid;
  const truncateText = (text: string, maxLength: number = 20) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const generateTooltip = (relationship: any) => {
    if (!relationship.properties) return "No properties available.";
    let tooltipContent = "";
    const rsType = relationship.type;
    if (rsType == "FINETUNED_BY") {
      tooltipContent += "Finetune Properties: \n";
    } else if (rsType == "COMBINES_WITH") {
      tooltipContent += "Federated Learn Properties: \n";
    }
    Object.entries(relationship.properties).forEach(([key, value]) => {
      if (key === "performance_json") return;

      tooltipContent += `${key}: ${truncateText(String(value), 8)}\n`;
    });

    return tooltipContent;
  };

  const renderVisualization = () => {
    if (!weightId || !vizRef.current) return;
    const config: NeovisConfig = {
      containerId: vizRef.current.id,
      neo4j: {
        serverUrl: process.env.NEXT_PUBLIC_NEO4J_SERVER_URL,
        serverUser: process.env.NEXT_PUBLIC_NEO4J_SERVER_USER,
        serverPassword: process.env.NEXT_PUBLIC_NEO4J_SERVER_PASSWORD,
        driverConfig: {
          encrypted: "ENCRYPTION_ON",
          trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES",
        },
      },
      visConfig: {
        layout: {
          hierarchical: {
            enabled: true,
            direction: "UD",
          },
        },
        interaction: {
          hover: true,
          tooltipDelay: 100,
        },
        nodes: {
          shape: "dot",
          font: {
            size: 15,
            color: "#0000000",
            vadjust: -60,
          },
        },
        edges: {
          arrows: {
            to: { enabled: true },
          },
          smooth: false,
        },
      },
      labels: {
        Dataset: {
          label: "uniqueIdentifier",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            static: {
              group: "dataset",
              color: "#3498db",
              size: 10,
            },
          },
        },
        Weight: {
          label: "uniqueIdentifier",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              label: (node: any) =>
                formatUUID(node.properties.uniqueIdentifier),
            },
            static: {
              group: "weight",
              color: "#e74c3c",
              size: 45,
            },
          },
        },
      },
      relationships: {
        COMBINES_WITH: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: (relationship: any) => generateTooltip(relationship),
            },
            static: {
              label: "",
              color: "#e74c3c",
              thickness: 2,
            },
          },
        },
        EVALUATED_ON: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: (relationship: any) => generateTooltip(relationship),
            },
            static: {
              label: "Evaluated On",
            },
          },
        },
        FINETUNED_BY: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: (relationship: any) => generateTooltip(relationship),
            },
            static: {
              label: "",
              color: "#3498db",
              thickness: 2,
            },
          },
        },
      },
      initialCypher: `MATCH (w:Weight {uniqueIdentifier: '${weightId}'}) MATCH path = (n)-[rels*1..${recursionDepth}]->(w) WHERE ALL(rel IN rels WHERE type(rel) IN ['COMBINES_WITH', 'FINETUNED_BY']) WITH nodes(path) AS ns, rels AS rs UNWIND range(0, size(ns)-2) AS i RETURN DISTINCT ns[i] AS n, rs[i] AS r, ns[i+1] AS m UNION MATCH (w:Weight {uniqueIdentifier: '${weightId}'}) OPTIONAL MATCH (w)-[r]->(x) WHERE type(r) IN ['COMBINES_WITH', 'FINETUNED_BY'] WITH w, count(r) AS relCount WHERE relCount = 0 RETURN w AS n, null AS r, null AS m`, //sorry this had to be done
    };

    vizInstanceRef.current = new NeoVis(config);
    vizInstanceRef.current.render();

    vizInstanceRef.current?.registerOnEvent("clickNode", (event: any) => {
      const node = event.node.raw;
      const labels = node.labels;
      const nodeLabel = node.properties.uniqueIdentifier;
      const network = vizInstanceRef.current.network;
      network.fit({ scale: 1 });

      if (labels.includes("Weight") && nodeLabel) {
        router.push(`/weight/${nodeLabel}`);
      } else if (labels.includes("Dataset") && nodeLabel) {
        router.push(`/dataset/${nodeLabel}`);
      }
    });
    vizInstanceRef.current?.registerOnEvent("clickEdge", (event: any) => {
      const edge = event.edge.raw;
      const network = vizInstanceRef.current.network;
      network.fit({ scale: 1 });
      if (edge.properties && edge.properties.dataset) {
        const datasetId = edge.properties.dataset;
        router.push(`/dataset/${datasetId}`);
      }
    });
  };

  useEffect(() => {
    renderVisualization();
    console.log("weightid", weightId);
    return () => {
      vizInstanceRef.current?.clearNetwork();
    };
  }, [weightId, recursionDepth]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="depthRange">Recursion Depth: {recursionDepth}</label>
        <input
          id="depthRange"
          type="range"
          min="0"
          max="5"
          value={recursionDepth}
          onChange={(e) => setRecursionDepth(Number(e.target.value))}
        />
      </div>
      <div
        id="viz"
        ref={vizRef}
        style={{ width: "900px", height: "700px" }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          background: "#fff",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 0 5px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          <span
            style={{
              background: "#e74c3c",
              display: "inline-block",
              width: "15px",
              height: "15px",
              marginRight: "5px",
            }}
          ></span>
          <span>Combines With</span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          <span
            style={{
              background: "#3498db",
              display: "inline-block",
              width: "15px",
              height: "15px",
              marginRight: "5px",
            }}
          ></span>
          <span>Finetuned By</span>
        </div>
      </div>
    </div>
  );
};

export default WeightTrace;
