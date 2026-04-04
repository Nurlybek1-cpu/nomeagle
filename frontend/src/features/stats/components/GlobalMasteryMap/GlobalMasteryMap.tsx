import React, { useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Card } from '../../../../components/ui';
import styles from './GlobalMasteryMap.module.css';

const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/v1/topojson-maps/world-110m.json';

export interface MasteryData {
  countryCode: string; // ISO Alpha-2
  score: number;       // 0 - 100
  recallScore: number; // 0 - 10
  breakdown: {
    landmarks: number; // 0 - 100
    traditions: number; // 0 - 100
    language: number; // 0 - 100
  };
}

export interface GlobalMasteryMapProps {
  data: MasteryData[];
  className?: string;
}

const getCountryName = (code: string) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
};

export const GlobalMasteryMap: React.FC<GlobalMasteryMapProps> = ({
  data,
  className,
}) => {
  const [viewMode, setViewMode] = useState<'mastery' | 'recall'>('mastery');
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  // --- Scales ---
  const masteryColorScale = useMemo(() => {
    return scaleLinear<string>().domain([1, 100]).range(['#dcfce7', '#15803d']); // Light Green -> Deep Green
  }, []);

  const recallColorScale = useMemo(() => {
    return scaleLinear<string>().domain([1, 10]).range(['#dbeafe', '#1d4ed8']); // Light Blue -> Deep Blue
  }, []);

  // --- Mapping Data for quick lookup ---
  const dataMap = useMemo(() => {
    const map = new Map<string, MasteryData>();
    data.forEach((d) => map.set(d.countryCode.toUpperCase(), d));
    return map;
  }, [data]);

  const activeData = activeCountry ? dataMap.get(activeCountry) : null;

  return (
    <div className={`w-full flex flex-col gap-6 mt-6 ${className || ''}`}>
      {/* Structural Card Layout */}
      <Card className={`${styles.card} p-8 shadow-sm border border-gray-100`}>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Column: Text & Controls */}
          <div className="lg:w-1/3 flex flex-col gap-6 flex-shrink-0">
            <h3 className="m-0 text-2xl font-normal text-slate-700">
              Cultural Mastery
            </h3>

            <p className="text-[15px] text-slate-500 leading-relaxed m-0">
              This color-coded map shows your overall cultural mastery and recall capability per country. 
              The darker the blue, the faster your recall. In mastery view, deeper green indicates perfect accuracy. 
              Light gray regions have not been practiced yet.
            </p>

            {/* Toggles */}
            <div className={`${styles.toggleButtonGroup} border border-gray-200 bg-gray-50 flex p-1 rounded-lg w-fit`}>
              <button 
                className={`${styles.toggleButton} ${viewMode === 'mastery' ? styles.active : ''}`}
                onClick={() => setViewMode('mastery')}
              >
                Mastery
              </button>
              <button 
                className={`${styles.toggleButton} ${viewMode === 'recall' ? styles.active : ''}`}
                onClick={() => setViewMode('recall')}
              >
                Recall
              </button>
            </div>

            {/* Drill Down breakdown via Framer Motion */}
            <div className="w-full mt-2 min-h-[140px]">
              <AnimatePresence mode="wait">
                {activeCountry && activeData && (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.3 }}
                    className="w-full pt-2"
                  >
                    <h4 className="text-sm font-bold mb-4 text-slate-700">
                      Regional Breakdown: {getCountryName(activeCountry)}
                    </h4>
                    <div className="flex flex-col gap-4">
                      {/* Landmarks */}
                      <div className="flex items-center gap-3">
                        <span className="w-24 text-right text-xs text-slate-500 font-bold uppercase tracking-wider">Landmarks</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                          <motion.div 
                            className={`${viewMode === 'mastery' ? 'bg-green-500' : 'bg-blue-500'} h-full rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(2, activeData.breakdown.landmarks)}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      {/* Traditions */}
                      <div className="flex items-center gap-3">
                        <span className="w-24 text-right text-xs text-slate-500 font-bold uppercase tracking-wider">Traditions</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                          <motion.div 
                            className={`${viewMode === 'mastery' ? 'bg-green-500' : 'bg-blue-500'} h-full rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(2, activeData.breakdown.traditions)}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      {/* Language */}
                      <div className="flex items-center gap-3">
                        <span className="w-24 text-right text-xs text-slate-500 font-bold uppercase tracking-wider">Language</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                          <motion.div 
                            className={`${viewMode === 'mastery' ? 'bg-green-500' : 'bg-blue-500'} h-full rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(2, activeData.breakdown.language)}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeCountry && !activeData && (
                  <motion.div
                    key="nodata"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full pt-4 text-sm text-slate-400 italic"
                  >
                    No historical practice data for {activeCountry}. Start learning!
                  </motion.div>
                )}
                {!activeCountry && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full pt-8 text-sm text-slate-400"
                  >
                    Click any country to view its breakdown.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Map Container */}
          <div className="flex-1 w-full flex items-center justify-center">
            <div className={`bg-[#f8f9fa] border border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] rounded-xl overflow-hidden w-full h-auto flex items-center justify-center p-4 min-h-[350px] ${styles.mapContainer}`}>
              <ComposableMap
                projectionConfig={{ scale: 140 }}
                width={800}
                height={400}
                style={{ width: '100%', height: 'auto', maxHeight: '420px' }}
              >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const iso2 = (geo.properties.ISO_A2 || geo.properties.iso_a2 || '').toUpperCase();
                        const countryData = dataMap.get(iso2);
                        const isActive = activeCountry === iso2;

                        let fill = '#e2e8f0'; // Default slate-200
                        
                        if (countryData) {
                          if (viewMode === 'mastery' && countryData.score > 0) {
                            fill = masteryColorScale(countryData.score) as string;
                          } else if (viewMode === 'recall' && countryData.recallScore > 0) {
                            fill = recallColorScale(countryData.recallScore) as string;
                          }
                        }

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={fill}
                            stroke={isActive ? '#f97316' : '#ffffff'} // Orange highlight if active
                            strokeWidth={isActive ? 1.5 : 0.6}
                            onClick={() => setActiveCountry(isActive ? null : iso2)}
                            style={{
                              default: { outline: 'none' },
                              hover: { fill: isActive ? fill : '#cbd5e1', outline: 'none', cursor: 'pointer' },
                              pressed: { outline: 'none' },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
              </ComposableMap>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer Tips */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className={`flex-1 ${styles.tipCard}`}>
          <Lightbulb className="text-orange-500 w-5 h-5 flex-shrink-0" />
          <p className={styles.tipText}>
            <b>Tip:</b> Deeper green indicates perfect accuracy in this region's landmarks and culture.
          </p>
        </div>
        <div className={`flex-1 ${styles.tipCard}`}>
          <Lightbulb className="text-orange-500 w-5 h-5 flex-shrink-0" />
          <p className={styles.tipText}>
            <b>Tip:</b> Darker blue means your recall speed is faster (under 2 seconds).
          </p>
        </div>
        <div className={`flex-1 ${styles.tipCard}`}>
          <Lightbulb className="text-orange-500 w-5 h-5 flex-shrink-0" />
          <p className={styles.tipText}>
            <b>Tip:</b> Click any colored country on the map to see exactly what you need to practice.
          </p>
        </div>
      </div>
    </div>
  );
};
