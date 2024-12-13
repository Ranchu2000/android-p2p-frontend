import { useEffect, useRef } from "react";
import NeoVis from "neovis.js";
import { useRouter } from "next/navigation";

interface WeightTreeProps {
  weightId: string;
}

const WeightTrace = ({ weightId }: WeightTreeProps) => {
  const vizRef = useRef<HTMLDivElement>(null);
  const vizInstanceRef = useRef<any>(null);
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
        serverUrl: "bolt://192.168.1.5:7687", //"bolt://localhost:7687",
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
          label: "uniqueIdentifier",
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
      OPTIONAL MATCH path = (n)-[r*]->(w:Weight {uniqueIdentifier: '${weightId}'})
      WITH nodes(path) AS nodes, relationships(path) AS relationships
      RETURN nodes, relationships
      UNION
      MATCH (w:Weight {uniqueIdentifier: '${weightId}'})
      RETURN [w] AS nodes, [] AS relationships
    `,
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
  };

  useEffect(() => {
    renderVisualization();
    return () => {
      vizInstanceRef.current?.clearNetwork();
    };
  }, [weightId]);

  return (
    <div>
      <div
        id="viz"
        ref={vizRef}
        style={{ width: "900px", height: "700px" }}
      ></div>
    </div>
  );
};

export default WeightTrace; // Export as default
