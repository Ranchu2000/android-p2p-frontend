import { useEffect, useRef } from "react";
import NeoVis from "neovis.js";
interface WeightTreeProps {
  weightId: string;
}
import { useRouter } from "next/navigation";
export function WeightTrace({ weightId }: WeightTreeProps) {
  const vizRef = useRef<HTMLDivElement>(null);
  const vizInstanceRef = useRef<any>(null); // Store the NeoVis instance
  const router = useRouter();
  const generateTooltip = (relationship: any) => {
    let titleString = "Properties:\n";
    if (relationship.properties) {
      Object.entries(relationship.properties).forEach(([key, value]) => {
        titleString += `${key}: ${value}\n`;
      });
    }
    return titleString;
  };

  const renderVisualization = () => {
    if (!weightId || !vizRef.current) return;

    const config = {
      containerId: vizRef.current.id,
      neo4j: {
        serverUrl: "bolt://localhost:7687",
        serverUser: "neo4j",
        serverPassword: "wongyufei",
      },
      visConfig: {
        nodes: {
          shape: "circle",
        },
        edges: {
          arrows: {
            to: { enabled: true },
          },
        },
      },
      labels: {
        // User: {
        //   label: "username",
        //   [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
        //     static: {
        //       group: "user",
        //       color: "#8e44ad",
        //     },
        //   },
        // },
        Dataset: {
          label: "uniqueIdentifier",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            static: {
              group: "dataset",
              color: "#3498db",
            },
          },
        },
        Weight: {
          label: "weight_unique_identifier",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            static: {
              group: "weight",
              color: "#e74c3c",
            },
          },
        },
      },
      relationships: {
        OWNED_BY: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: (relationship: any) => generateTooltip(relationship),
            },
            static: {
              label: "Owned By",
            },
          },
        },
        CREATED_BY: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: (relationship: any) => generateTooltip(relationship),
            },
            static: {
              label: "Created By",
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
              label: "Finetuned By",
            },
          },
        },
        COMBINES_WITH: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: (relationship: any) => generateTooltip(relationship),
            },
            static: {
              label: "Combines With",
            },
          },
        },
      },
      initialCypher: `
      OPTIONAL MATCH path = (n)-[r*]->(w:Weight {weight_unique_identifier: '${weightId}'})
      WITH nodes(path) AS nodes, relationships(path) AS relationships
      RETURN nodes, relationships
      UNION
      MATCH (w:Weight {weight_unique_identifier: '${weightId}'})
      RETURN [w] AS nodes, [] AS relationships
    `,
    };

    vizInstanceRef.current = new NeoVis(config);
    vizInstanceRef.current.render();
    vizInstanceRef.current?.registerOnEvent("clickNode", (event: any) => {
      const node = event.node.raw;
      const labels = node.labels;
      const nodeLabel =
        node.properties.weight_unique_identifier ||
        node.properties.uniqueIdentifier;

      if (labels.includes("Weight") && nodeLabel) {
        router.push(`/weight/${nodeLabel}`);
      } else if (labels.includes("Dataset") && nodeLabel) {
        router.push(`/dataset/${nodeLabel}`);
      } else {
        console.warn("Unknown node type or missing label:", labels);
      }
    });
  };

  useEffect(() => {
    renderVisualization();
    return () => {
      if (vizInstanceRef.current) {
        vizInstanceRef.current.clearNetwork();
      }
    };
  }, [weightId]);

  return (
    <div>
      <div className="flex justify-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          <span className="text-gray-700">Dataset</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="text-gray-700">Weight</span>
        </div>
        {/* <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
          <span className="text-gray-700">User</span>
        </div> */}
      </div>
      <div
        id="viz"
        ref={vizRef}
        style={{
          width: "900px",
          height: "700px",
          border: "1px solid #dcdcdc",
          borderRadius: "5px",
          margin: "20px auto",
        }}
      ></div>
    </div>
  );
}
