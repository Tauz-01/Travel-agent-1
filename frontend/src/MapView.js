import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Line, Rect, Text as SvgText } from 'react-native-svg';
import { theme } from './theme';
import { MOCK_CITIES } from './mockData';

// Map city coordinates or fallback lookup to 2D SVG canvas bounds [width: 360, height: 210]
function getSvgCoordinates(legs = [], simulatedBusLocation = null) {
  // SVG viewport dimensions
  const SVG_WIDTH = 360;
  const SVG_HEIGHT = 210;
  const PADDING = 35;

  // Known city fallback coordinates (geographic lat, lng)
  const cityCoordsMap = {
    'visakhapatnam': { lat: 17.7231, lng: 83.3012 },
    'vizag': { lat: 17.7231, lng: 83.3012 },
    'vijayawada': { lat: 16.5062, lng: 80.6480 },
    'vja': { lat: 16.5062, lng: 80.6480 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'hyd': { lat: 17.3850, lng: 78.4867 },
    'tirupati': { lat: 13.6288, lng: 79.4192 },
    'guntur': { lat: 16.3067, lng: 80.4365 },
    'rajahmundry': { lat: 17.0005, lng: 81.8040 },
    'kakinada': { lat: 16.9891, lng: 82.2475 },
    'nellore': { lat: 14.4426, lng: 79.9865 },
    'kurnool': { lat: 15.8281, lng: 78.0373 },
    'anantapur': { lat: 14.6819, lng: 77.6006 },
    'warangal': { lat: 17.9689, lng: 79.5941 },
    'nizamabad': { lat: 18.6725, lng: 78.0941 },
    'khammam': { lat: 17.2473, lng: 80.1514 },
    'kadapa': { lat: 14.4673, lng: 78.8242 },
    'ongole': { lat: 15.5057, lng: 80.0499 },
    'eluru': { lat: 16.7107, lng: 81.1035 },
    'vizianagaram': { lat: 18.1124, lng: 83.4023 },
  };

  // Populate from MOCK_CITIES dynamically if available
  MOCK_CITIES.forEach(c => {
    if (c.city_name) {
      cityCoordsMap[c.city_name.toLowerCase()] = { lat: c.latitude, lng: c.longitude };
    }
  });

  // Extract stops from legs
  const stops = [];
  if (Array.isArray(legs) && legs.length > 0) {
    legs.forEach((leg, idx) => {
      if (leg.originStop) {
        stops.push({
          name: leg.originStop.name || leg.originStop.city || `Stop ${idx + 1}`,
          city: (leg.originStop.city || leg.originStop.name || '').toLowerCase(),
          lat: leg.originStop.latitude || null,
          lng: leg.originStop.longitude || null,
          isOrigin: idx === 0,
          isTransfer: idx > 0,
          isDest: false
        });
      }
      if (idx === legs.length - 1 && leg.destStop) {
        stops.push({
          name: leg.destStop.name || leg.destStop.city || `Destination`,
          city: (leg.destStop.city || leg.destStop.name || '').toLowerCase(),
          lat: leg.destStop.latitude || null,
          lng: leg.destStop.longitude || null,
          isOrigin: false,
          isTransfer: false,
          isDest: true
        });
      }
    });
  }

  // Fallback default stops if legs missing or empty
  if (stops.length === 0) {
    stops.push(
      { name: 'Vizag RTC', city: 'visakhapatnam', lat: 17.7231, lng: 83.3012, isOrigin: true },
      { name: 'Vijayawada PNBS', city: 'vijayawada', lat: 16.5062, lng: 80.6480, isTransfer: true },
      { name: 'Hyd MGBS', city: 'hyderabad', lat: 17.3850, lng: 78.4867, isDest: true }
    );
  }

  // Resolve lat/lng for each stop
  const resolvedStops = stops.map(s => {
    let lat = s.lat;
    let lng = s.lng;
    if (!lat || !lng) {
      const match = cityCoordsMap[s.city] || Object.keys(cityCoordsMap).find(k => s.city.includes(k)) && cityCoordsMap[Object.keys(cityCoordsMap).find(k => s.city.includes(k))];
      if (match) {
        lat = match.lat;
        lng = match.lng;
      } else {
        // Fallback default
        lat = 16.5;
        lng = 80.5;
      }
    }
    return { ...s, lat, lng };
  });

  // Calculate bounding box for dynamic projection
  const lats = resolvedStops.map(s => s.lat);
  const lngs = resolvedStops.map(s => s.lng);

  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);
  let minLng = Math.min(...lngs);
  let maxLng = Math.max(...lngs);

  // Prevent division by zero if all points identical
  if (minLat === maxLat) { minLat -= 0.5; maxLat += 0.5; }
  if (minLng === maxLng) { minLng -= 0.5; maxLng += 0.5; }

  // Map geographic coords (lat, lng) to SVG canvas (x, y)
  // Longitude maps to X (East is larger X)
  // Latitude maps to Y (North is smaller Y in SVG top-down coords)
  const projectPoint = (lat, lng) => {
    const xRatio = (lng - minLng) / (maxLng - minLng);
    const yRatio = (lat - minLat) / (maxLat - minLat);

    const x = PADDING + xRatio * (SVG_WIDTH - 2 * PADDING);
    // Invert Y so higher latitude (north) is at the top (lower Y)
    const y = (SVG_HEIGHT - PADDING) - yRatio * (SVG_HEIGHT - 2 * PADDING);

    return { x: Math.round(x), y: Math.round(y) };
  };

  const projectedNodes = resolvedStops.map(s => {
    const pt = projectPoint(s.lat, s.lng);
    return { ...s, x: pt.x, y: pt.y };
  });

  // Polyline string points format: "x1,y1 x2,y2 ..."
  const polylinePoints = projectedNodes.map(n => `${n.x},${n.y}`).join(' ');

  // Bus vehicle marker location calculation
  let busX = 125;
  let busY = 118;

  if (simulatedBusLocation && typeof simulatedBusLocation.x === 'number') {
    busX = simulatedBusLocation.x;
    busY = simulatedBusLocation.y;
  } else if (projectedNodes.length >= 2) {
    // Interpolate midpoint between origin and 1st transfer stop for active bus
    busX = Math.round((projectedNodes[0].x + projectedNodes[1].x) / 2);
    busY = Math.round((projectedNodes[0].y + projectedNodes[1].y) / 2);
  }

  return { projectedNodes, polylinePoints, busX, busY };
}

export function InteractiveMapView({ legs = [], highlightedLegIndex = null, isDisrupted = false, simulatedBusLocation = null }) {
  const width = 360;
  const height = 210;

  const { projectedNodes, polylinePoints, busX, busY } = getSvgCoordinates(legs, simulatedBusLocation);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.mapTitle}>Route Geometry & Dynamic Transit Map</Text>
        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>Simulated GPS</Text>
        </View>
      </View>
      
      <View style={styles.svgContainer}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Background Map Grid Styling */}
          <Rect width={width} height={height} fill="#0F172A" rx={12} />
          
          {/* Grid lines */}
          <Line x1="0" y1="70" x2={width} y2="70" stroke="#1E293B" strokeWidth="1" strokeDasharray="4" />
          <Line x1="0" y1="140" x2={width} y2="140" stroke="#1E293B" strokeWidth="1" strokeDasharray="4" />
          <Line x1="120" y1="0" x2="120" y2={height} stroke="#1E293B" strokeWidth="1" strokeDasharray="4" />
          <Line x1="240" y1="0" x2="240" y2={height} stroke="#1E293B" strokeWidth="1" strokeDasharray="4" />

          {/* Dynamic Highway Corridor Route Polyline */}
          <Polyline
            points={polylinePoints}
            stroke={isDisrupted ? theme.colors.action : theme.colors.secondary}
            strokeWidth={isDisrupted ? "4" : "3"}
            strokeDasharray={isDisrupted ? "6,3" : "none"}
          />

          {/* Render Route Nodes / Stop Pins Dynamically */}
          {projectedNodes.map((node, index) => {
            const isFirst = index === 0;
            const isLast = index === projectedNodes.length - 1;
            const nodeColor = isDisrupted && !isFirst ? theme.colors.action : (isLast ? theme.colors.success : theme.colors.secondary);

            return (
              <React.Fragment key={`node-${index}-${node.name}`}>
                <Circle
                  cx={node.x}
                  cy={node.y}
                  r={isFirst || isLast ? "7" : "6"}
                  fill={nodeColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <SvgText
                  x={node.x - 20}
                  y={node.y > 150 ? node.y - 12 : node.y + 18}
                  fill={isDisrupted && !isFirst ? "#FF8A8A" : "#E2E8F0"}
                  fontSize="9"
                  fontWeight="bold"
                >
                  {node.name.length > 14 ? `${node.name.substring(0, 12)}..` : node.name}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Active Simulated Vehicle Marker */}
          <Circle 
            cx={busX} 
            cy={busY} 
            r="10" 
            fill={theme.colors.action} 
            stroke="#FFFFFF" 
            strokeWidth="2" 
          />
          <SvgText 
            x={busX - 4} 
            y={busY + 4} 
            fill="#FFFFFF" 
            fontSize="9" 
            fontWeight="bold"
          >
            🚌
          </SvgText>
        </Svg>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.secondary }]} />
          <Text style={styles.legendText}>
            {projectedNodes.length > 0 ? `${projectedNodes[0].name.split(' ')[0]} Route` : 'Leg 1'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.success }]} />
          <Text style={styles.legendText}>
            {projectedNodes.length > 1 ? `To ${projectedNodes[projectedNodes.length - 1].name.split(' ')[0]}` : 'Leg 2'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.action }]} />
          <Text style={styles.legendText}>Simulated Bus</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  demoBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  svgContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  }
});
