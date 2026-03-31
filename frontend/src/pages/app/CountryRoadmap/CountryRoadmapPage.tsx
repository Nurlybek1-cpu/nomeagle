import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { CountryRoadmap } from "../../../features/map-roadmap/components/CountryRoadmap/CountryRoadmap";
import { kazakhstanRoadmapMock } from "../../../features/map-roadmap/mock/kazakhstanRoadmap.mock";
import { getUnlockedNodes } from "../../../features/map-roadmap/utils/progression";
import { useRoadmapNavigation } from "../../../features/map-roadmap/hooks/useRoadmapNavigation";
import styles from "./CountryRoadmapPage.module.css";

export const CountryRoadmapPage: React.FC = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  
  // In a full application we would fetch the dynamic roadmap data matching the `countryCode`.
  // Here we use the kazakhstan mockup data as requested.
  const baseRoadmap = kazakhstanRoadmapMock;

  // Use the progression utility created earlier to apply the local progression state to the map
  const roadmapWithProgression = useMemo(() => {
    return {
      ...baseRoadmap,
      nodes: getUnlockedNodes(baseRoadmap.nodes),
    };
  }, [baseRoadmap]);

  const { handleNodeClick } = useRoadmapNavigation(countryCode || baseRoadmap.countryCode.toLowerCase());

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <CountryRoadmap
          roadmap={roadmapWithProgression}
          onNodeClick={(nodeId) => {
            const targetNode = roadmapWithProgression.nodes.find((n) => n.id === nodeId);
            if (targetNode && !targetNode.isLocked) {
              handleNodeClick(targetNode);
            }
          }}
        />
      </main>
    </div>
  );
};
