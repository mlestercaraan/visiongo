'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';

type AreaEntry = {
  id: string;
  province: string;
  municipality: string;
  barangay: string;
  is_serviceable: boolean;
  waitlist_count: number;
};

type GeoEntry = {
  id: string;
  lat: number;
  lng: number;
  zip: string;
};

const GEO: GeoEntry[] = [
  { id: 'sa-001', lat: 13.9558, lng: 121.1640, zip: '4217' },
  { id: 'sa-002', lat: 13.9520, lng: 121.1700, zip: '4217' },
  { id: 'sa-003', lat: 13.7600, lng: 121.0590, zip: '4200' },
  { id: 'sa-004', lat: 13.7530, lng: 121.0520, zip: '4200' },
  { id: 'sa-005', lat: 14.0860, lng: 121.1500, zip: '4232' },
  { id: 'sa-006', lat: 14.0920, lng: 121.1560, zip: '4232' },
  { id: 'sa-007', lat: 14.1080, lng: 121.1440, zip: '4234' },
  { id: 'sa-008', lat: 13.9300, lng: 121.6180, zip: '4301' },
  { id: 'sa-009', lat: 13.9380, lng: 121.6100, zip: '4301' },
  { id: 'sa-010', lat: 14.1150, lng: 121.5560, zip: '4328' },
  { id: 'sa-011', lat: 14.0270, lng: 121.5920, zip: '4327' },
  { id: 'sa-012', lat: 14.8350, lng: 120.2840, zip: '2200' },
  { id: 'sa-013', lat: 14.8280, lng: 120.2820, zip: '2200' },
  { id: 'sa-014', lat: 14.7380, lng: 120.2400, zip: '2209' },
  { id: 'sa-015', lat: 15.3240, lng: 119.9790, zip: '2201' },
];

const ZIP_CENTERS: Record<string, [number, number]> = {
  '4200': [13.7565, 121.0583],
  '4217': [13.9540, 121.1670],
  '4232': [14.0890, 121.1530],
  '4234': [14.1080, 121.1440],
  '4301': [13.9340, 121.6140],
  '4327': [14.0270, 121.5920],
  '4328': [14.1150, 121.5560],
  '2200': [14.8310, 120.2830],
  '2201': [15.3240, 119.9790],
  '2209': [14.7380, 120.2400],
};

const PROVINCE_COLOR: Record<string, string> = {
  Batangas: '#405189',
  'Quezon Province': '#299CDB',
  Zambales: '#0AB39C',
};

function makeIcon(L: typeof import('leaflet'), color: string, size = 10) {
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);"></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function ServiceAreaMap({ areas }: { areas: AreaEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const [zip, setZip] = useState('');
  const [zipError, setZipError] = useState('');

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      const map = L.map(containerRef.current!, {
        center: [14.0, 121.0],
        zoom: 8,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      L.control.attribution({ prefix: false }).addTo(map);

      mapRef.current = map;

      areas.forEach((area) => {
        const geo = GEO.find((g) => g.id === area.id);
        if (!geo) return;

        const pinColor = area.is_serviceable
          ? '#0AB39C'
          : area.waitlist_count > 0
          ? '#F7B84B'
          : '#94A3B8';

        const marker = L.marker([geo.lat, geo.lng], {
          icon: makeIcon(L, pinColor, 12),
        });

        marker.bindPopup(
          `<div style="font-family:system-ui,sans-serif;min-width:160px">
            <div style="font-weight:700;font-size:13px;color:#212529;margin-bottom:4px">${area.barangay}</div>
            <div style="font-size:12px;color:#6c757d;margin-bottom:6px">${area.municipality}, ${area.province}</div>
            <div style="display:flex;gap:6px;align-items:center">
              <span style="padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:${area.is_serviceable ? '#E7F8F5' : '#F3F6F9'};color:${area.is_serviceable ? '#0AB39C' : '#878A99'}">
                ${area.is_serviceable ? 'Covered' : 'Not yet'}
              </span>
              ${area.waitlist_count > 0 ? `<span style="font-size:11px;color:#F7B84B;font-weight:600">${area.waitlist_count} waiting</span>` : ''}
            </div>
          </div>`,
          { maxWidth: 220 }
        );

        marker.addTo(map);
        markersRef.current.set(area.id, marker);
      });
    })();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    (async () => {
      const L = (await import('leaflet')).default;
      markersRef.current.forEach((marker, id) => marker.remove());
      markersRef.current.clear();

      areas.forEach((area) => {
        const geo = GEO.find((g) => g.id === area.id);
        if (!geo || !mapRef.current) return;
        const pinColor = area.is_serviceable
          ? '#0AB39C'
          : area.waitlist_count > 0
          ? '#F7B84B'
          : '#94A3B8';
        const marker = L.marker([geo.lat, geo.lng], {
          icon: makeIcon(L, pinColor, 12),
        });
        marker.bindPopup(
          `<div style="font-family:system-ui,sans-serif;min-width:160px">
            <div style="font-weight:700;font-size:13px;color:#212529;margin-bottom:4px">${area.barangay}</div>
            <div style="font-size:12px;color:#6c757d;margin-bottom:6px">${area.municipality}, ${area.province}</div>
            <div style="display:flex;gap:6px;align-items:center">
              <span style="padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:${area.is_serviceable ? '#E7F8F5' : '#F3F6F9'};color:${area.is_serviceable ? '#0AB39C' : '#878A99'}">
                ${area.is_serviceable ? 'Covered' : 'Not yet'}
              </span>
              ${area.waitlist_count > 0 ? `<span style="font-size:11px;color:#F7B84B;font-weight:600">${area.waitlist_count} waiting</span>` : ''}
            </div>
          </div>`,
          { maxWidth: 220 }
        );
        marker.addTo(mapRef.current);
        markersRef.current.set(area.id, marker);
      });
    })();
  }, [areas]);

  const handleZipSearch = () => {
    const trimmed = zip.trim();
    if (!trimmed) return;

    const center = ZIP_CENTERS[trimmed];
    if (!center) {
      setZipError('No service areas found for that zip code.');
      return;
    }
    setZipError('');
    mapRef.current?.flyTo(center, 13, { duration: 1.2 });

    const matchIds = GEO.filter((g) => g.zip === trimmed).map((g) => g.id);
    matchIds.forEach((id) => {
      const m = markersRef.current.get(id);
      if (m) m.openPopup();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleZipSearch();
  };

  return (
    <div className="bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)', overflow: 'hidden' }}>
      {/* Map header + search */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid #F3F6F9' }}>
        <div>
          <p className="text-[14px] font-semibold" style={{ color: '#212529' }}>Coverage Map</p>
          <p className="text-[12px]" style={{ color: '#ADB5BD' }}>Search by zip code to locate a service area</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              value={zip}
              onChange={(e) => { setZip(e.target.value); setZipError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 4217"
              maxLength={6}
              className="h-8 pl-3 pr-3 rounded-lg text-[13px] outline-none w-28"
              style={{ border: zipError ? '1px solid #F06548' : '1px solid #E9EBEC', color: '#495057', background: '#fff' }}
            />
          </div>
          <button
            onClick={handleZipSearch}
            className="h-8 px-3 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: '#405189', color: '#fff' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Search
          </button>
          {/* Legend */}
          <div className="flex items-center gap-3 ml-2 pl-3" style={{ borderLeft: '1px solid #E9EBEC' }}>
            {[['#0AB39C', 'Covered'], ['#F7B84B', 'Waitlist'], ['#94A3B8', 'Not yet']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-white flex-shrink-0" style={{ background: c, boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                <span className="text-[11px]" style={{ color: '#6c757d' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {zipError && (
        <div className="px-5 py-1.5 text-[12px]" style={{ color: '#F06548', background: '#FFF5F3', borderBottom: '1px solid #FFE8E3' }}>
          {zipError}
        </div>
      )}
      <div ref={containerRef} style={{ height: '380px', width: '100%' }} />
    </div>
  );
}
