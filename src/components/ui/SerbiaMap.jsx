import React, { useState } from 'react';
import { MapPin, Users, Clock, Star } from 'lucide-react';

const SerbiaMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Demo podaci o radnicima po regionima Srbije
  const serbiaRegions = [
    {
      id: 'beograd',
      name: 'Beograd',
      center: { x: 50, y: 30 },
      workers: 45,
      activeWorkers: 38,
      avgRating: 4.7,
      color: 'bg-blue-500',
      cities: ['Novi Beograd', 'Stari Grad', 'Zemun', 'Palilula', 'Vračar']
    },
    {
      id: 'vojvodina',
      name: 'Vojvodina',
      center: { x: 30, y: 15 },
      workers: 32,
      activeWorkers: 28,
      avgRating: 4.6,
      color: 'bg-green-500',
      cities: ['Novi Sad', 'Subotica', 'Zrenjanin', 'Pančevo', 'Kikinda']
    },
    {
      id: 'sumadija',
      name: 'Šumadija',
      center: { x: 45, y: 45 },
      workers: 28,
      activeWorkers: 24,
      avgRating: 4.5,
      color: 'bg-yellow-500',
      cities: ['Kragujevac', 'Jagodina', 'Kraljevo', 'Čačak', 'Aranđelovac']
    },
    {
      id: 'juzna-srbija',
      name: 'Južna Srbija',
      center: { x: 55, y: 60 },
      workers: 22,
      activeWorkers: 19,
      avgRating: 4.4,
      color: 'bg-red-500',
      cities: ['Niš', 'Leskovac', 'Vranje', 'Prokuplje', 'Kuršumlija']
    },
    {
      id: 'zapadna-srbija',
      name: 'Zapadna Srbija',
      center: { x: 25, y: 50 },
      workers: 18,
      activeWorkers: 15,
      avgRating: 4.3,
      color: 'bg-purple-500',
      cities: ['Užice', 'Valjevo', 'Šabac', 'Loznica', 'Kruševac']
    },
    {
      id: 'istocna-srbija',
      name: 'Istočna Srbija',
      center: { x: 70, y: 40 },
      workers: 15,
      activeWorkers: 12,
      avgRating: 4.2,
      color: 'bg-orange-500',
      cities: ['Zaječar', 'Bor', 'Negotin', 'Knjaževac', 'Sokobanja']
    }
  ];

  const handleRegionClick = (region) => {
    setSelectedRegion(selectedRegion?.id === region.id ? null : region);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Mapa Radnika - Srbija
        </h3>
        <p className="text-sm text-muted-foreground">
          Pregled aktivnih radnika po regionima Srbije
        </p>
      </div>

      <div className="relative">
        {/* Mapa Srbije - SVG */}
        <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-border">
          {/* Kontur Srbije */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
          >
            {/* Pojednostavljena kontur Srbije */}
            <path
              d="M20 20 L80 15 L85 25 L90 40 L85 60 L80 75 L70 80 L60 85 L40 88 L25 85 L20 75 L18 60 L20 45 L22 30 Z"
              fill="none"
              stroke="#374151"
              strokeWidth="0.5"
              className="opacity-30"
            />
            
            {/* Regioni sa gradovima */}
            {serbiaRegions.map((region) => (
              <g key={region.id}>
                {/* Glavni gradovi */}
                <circle
                  cx={region.center.x}
                  cy={region.center.y}
                  r="2"
                  className={`${region.color} cursor-pointer transition-all duration-200 hover:scale-125`}
                  onClick={() => handleRegionClick(region)}
                />
                
                {/* Broj radnika */}
                <text
                  x={region.center.x}
                  y={region.center.y + 4}
                  textAnchor="middle"
                  className="text-xs font-medium fill-foreground"
                >
                  {region.workers}
                </text>
              </g>
            ))}
          </svg>

          {/* Legenda */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border">
            <div className="text-xs font-medium text-foreground mb-2">Legenda:</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Beograd</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Vojvodina</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Šumadija</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detalji o regionu */}
        {selectedRegion && (
          <div className="absolute top-4 right-4 bg-background border border-border rounded-lg p-4 shadow-lg max-w-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">{selectedRegion.name}</h4>
              <button
                onClick={() => setSelectedRegion(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Ukupno radnika: <span className="font-medium">{selectedRegion.workers}</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Aktivni: <span className="font-medium">{selectedRegion.activeWorkers}</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Star size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Prosečna ocena: <span className="font-medium">{selectedRegion.avgRating}</span>
                </span>
              </div>
              
              <div className="pt-2 border-t border-border">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Glavni gradovi:
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedRegion.cities.map((city) => (
                    <span
                      key={city}
                      className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistika */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-foreground">160</div>
              <div className="text-sm text-muted-foreground">Ukupno radnika</div>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock size={20} className="text-green-500" />
            <div>
              <div className="text-2xl font-bold text-foreground">136</div>
              <div className="text-sm text-muted-foreground">Aktivni radnici</div>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Star size={20} className="text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-foreground">4.5</div>
              <div className="text-sm text-muted-foreground">Prosečna ocena</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerbiaMap;
