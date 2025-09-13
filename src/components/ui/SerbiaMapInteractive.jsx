import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Icon from '../../components/AppIcon';

// Fix za Leaflet ikone
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SerbiaMapInteractive = () => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Centar Srbije (Beograd)
  const serbiaCenter = [44.7866, 20.4489];
  
  // Granice Srbije (približno)
  const serbiaBounds = [
    [42.2322, 18.8145], // Jugozapad
    [46.1819, 23.0069]  // Severoistok
  ];

  // Generisanje random radnika po celoj Srbiji
  useEffect(() => {
    const generateRandomWorkers = () => {
      const workerCategories = [
        'Aparati', 'Čišćenje', 'Stolarija', 'Električne Instalacije', 
        'Vodoinstalaterske Usluge', 'Klima Uređaji', 'Alarmi', 'Kamera Sistemi'
      ];
      
      const workerNames = [
        'Petar Jovanović', 'Ana Marković', 'Milan Đorđević', 'Jelena Nikolić',
        'Stefan Petrović', 'Marija Stojanović', 'Nikola Ilić', 'Sofija Janković',
        'Aleksandar Popović', 'Teodora Đokić', 'Marko Ristić', 'Elena Vuković',
        'Vuk Stanković', 'Nina Milić', 'Luka Pavlović', 'Jovana Simić'
      ];

      const cities = [
        { name: 'Beograd', coords: [44.7866, 20.4489], workers: 45 },
        { name: 'Novi Sad', coords: [45.2551, 19.8452], workers: 32 },
        { name: 'Niš', coords: [43.3247, 21.9033], workers: 28 },
        { name: 'Kragujevac', coords: [44.0165, 20.9204], workers: 25 },
        { name: 'Subotica', coords: [46.1009, 19.6676], workers: 18 },
        { name: 'Zrenjanin', coords: [45.3786, 20.3995], workers: 22 },
        { name: 'Pančevo', coords: [44.8714, 20.6417], workers: 20 },
        { name: 'Čačak', coords: [43.8914, 20.3497], workers: 19 },
        { name: 'Kraljevo', coords: [43.7259, 20.6896], workers: 17 },
        { name: 'Novi Pazar', coords: [43.1376, 20.5174], workers: 15 },
        { name: 'Kruševac', coords: [43.5800, 21.3339], workers: 16 },
        { name: 'Užice', coords: [43.8564, 19.8444], workers: 14 },
        { name: 'Smederevo', coords: [44.6659, 20.9335], workers: 18 },
        { name: 'Leskovac', coords: [42.9981, 21.9465], workers: 16 },
        { name: 'Vranje', coords: [42.5563, 21.9002], workers: 12 },
        { name: 'Valjevo', coords: [44.2724, 19.8877], workers: 15 },
        { name: 'Šabac', coords: [44.7538, 19.6908], workers: 14 },
        { name: 'Sombor', coords: [45.7742, 19.1141], workers: 13 },
        { name: 'Požarevac', coords: [44.6210, 21.1878], workers: 16 },
        { name: 'Pirot', coords: [43.1550, 22.5858], workers: 11 },
        { name: 'Zaječar', coords: [43.9036, 22.2760], workers: 12 },
        { name: 'Kikinda', coords: [45.8294, 20.4651], workers: 13 },
        { name: 'Vršac', coords: [45.1209, 21.2986], workers: 12 },
        { name: 'Sremska Mitrovica', coords: [44.9764, 19.6122], workers: 14 },
        { name: 'Jagodina', coords: [43.9791, 21.2583], workers: 13 },
        { name: 'Vrbas', coords: [45.5714, 19.6408], workers: 10 },
        { name: 'Ruma', coords: [45.0081, 19.8222], workers: 11 },
        { name: 'Bačka Palanka', coords: [45.2500, 19.4000], workers: 12 },
        { name: 'Prokuplje', coords: [43.2342, 21.5881], workers: 10 },
        { name: 'Inđija', coords: [45.0481, 20.0816], workers: 11 },
        { name: 'Loznica', coords: [44.5342, 19.2258], workers: 10 },
        { name: 'Senta', coords: [45.9275, 20.0772], workers: 9 },
        { name: 'Kula', coords: [45.6089, 19.5264], workers: 8 },
        { name: 'Apatin', coords: [45.6725, 18.9778], workers: 7 },
        { name: 'Bečej', coords: [45.6167, 20.0333], workers: 8 },
        { name: 'Temerin', coords: [45.4089, 19.8889], workers: 7 },
        { name: 'Futog', coords: [45.2400, 19.7167], workers: 8 },
        { name: 'Stara Pazova', coords: [44.9850, 20.1600], workers: 9 },
        { name: 'Kovin', coords: [44.7486, 20.9764], workers: 6 },
        { name: 'Bela Crkva', coords: [44.8975, 21.4172], workers: 5 },
        { name: 'Alibunar', coords: [45.0800, 20.9667], workers: 6 },
        { name: 'Opovo', coords: [45.0500, 20.4333], workers: 5 },
        { name: 'Kovačica', coords: [45.1117, 20.6214], workers: 6 },
        { name: 'Plandište', coords: [45.2272, 21.1222], workers: 5 },
        { name: 'Bela Palanka', coords: [43.2189, 22.3139], workers: 4 },
        { name: 'Dimitrovgrad', coords: [43.0167, 22.7833], workers: 5 },
        { name: 'Bosilegrad', coords: [42.5000, 22.4667], workers: 3 },
        { name: 'Preševo', coords: [42.3092, 21.6492], workers: 4 },
        { name: 'Bujanovac', coords: [42.4650, 21.7667], workers: 3 },
        { name: 'Medveđa', coords: [42.8444, 21.5856], workers: 4 },
        { name: 'Kuršumlija', coords: [43.1397, 21.2731], workers: 3 },
        { name: 'Blace', coords: [43.2833, 21.2833], workers: 2 },
        { name: 'Žitorađa', coords: [43.1900, 21.7083], workers: 3 },
        { name: 'Merošina', coords: [43.2833, 21.7167], workers: 2 },
        { name: 'Ražanj', coords: [43.6667, 21.5500], workers: 3 },
        { name: 'Sokobanja', coords: [43.6417, 21.8711], workers: 2 },
        { name: 'Knjaževac', coords: [43.5667, 22.2500], workers: 3 },
        { name: 'Zaječar', coords: [43.9036, 22.2760], workers: 2 },
        { name: 'Bela Palanka', coords: [43.2189, 22.3139], workers: 1 },
        { name: 'Pirot', coords: [43.1550, 22.5858], workers: 1 },
        { name: 'Dimitrovgrad', coords: [43.0167, 22.7833], workers: 1 },
        { name: 'Bosilegrad', coords: [42.5000, 22.4667], workers: 1 },
        { name: 'Preševo', coords: [42.3092, 21.6492], workers: 1 },
        { name: 'Bujanovac', coords: [42.4650, 21.7667], workers: 1 },
        { name: 'Medveđa', coords: [42.8444, 21.5856], workers: 1 },
        { name: 'Kuršumlija', coords: [43.1397, 21.2731], workers: 1 },
        { name: 'Blace', coords: [43.2833, 21.2833], workers: 1 },
        { name: 'Žitorađa', coords: [43.1900, 21.7083], workers: 1 },
        { name: 'Merošina', coords: [43.2833, 21.7167], workers: 1 },
        { name: 'Ražanj', coords: [43.6667, 21.5500], workers: 1 },
        { name: 'Sokobanja', coords: [43.6417, 21.8711], workers: 1 },
        { name: 'Knjaževac', coords: [43.5667, 22.2500], workers: 1 }
      ];

      const generatedWorkers = [];
      
      cities.forEach(city => {
        for (let i = 0; i < city.workers; i++) {
          // Dodaj malo random varijacije u koordinatama
          const latVariation = (Math.random() - 0.5) * 0.02;
          const lngVariation = (Math.random() - 0.5) * 0.02;
          
          const worker = {
            id: `${city.name}-${i + 1}`,
            name: workerNames[Math.floor(Math.random() * workerNames.length)],
            category: workerCategories[Math.floor(Math.random() * workerCategories.length)],
            city: city.name,
            coordinates: [
              city.coords[0] + latVariation,
              city.coords[1] + lngVariation
            ],
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
            hourlyRate: Math.floor(Math.random() * 20 + 15), // 15-35€
            status: Math.random() > 0.2 ? 'active' : 'busy',
            completedJobs: Math.floor(Math.random() * 50 + 10),
            verified: Math.random() > 0.3,
            lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          };
          
          generatedWorkers.push(worker);
        }
      });

      setWorkers(generatedWorkers);
    };

    generateRandomWorkers();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981'; // green
      case 'busy': return '#F59E0B'; // yellow
      case 'offline': return '#6B7280'; // gray
      default: return '#10B981';
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Aparati': '🔧',
      'Čišćenje': '🧹',
      'Stolarija': '🪚',
      'Električne Instalacije': '⚡',
      'Vodoinstalaterske Usluge': '🚰',
      'Klima Uređaji': '❄️',
      'Alarmi': '🚨',
      'Kamera Sistemi': '📹'
    };
    return iconMap[category] || '👷';
  };

  const totalWorkers = workers.length;
  const activeWorkers = workers.filter(w => w.status === 'active').length;
  const averageRating = (workers.reduce((sum, w) => sum + parseFloat(w.rating), 0) / workers.length).toFixed(1);
  const totalCompletedJobs = workers.reduce((sum, w) => sum + w.completedJobs, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ukupno Radnika</p>
              <p className="text-2xl font-bold text-foreground">{totalWorkers}</p>
            </div>
            <Icon name="Users" size={24} className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktivni</p>
              <p className="text-2xl font-bold text-foreground">{activeWorkers}</p>
            </div>
            <Icon name="CheckCircle" size={24} className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Prosečna Ocena</p>
              <p className="text-2xl font-bold text-foreground">{averageRating}/5.0</p>
            </div>
            <Icon name="Star" size={24} className="text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Završeni Poslovi</p>
              <p className="text-2xl font-bold text-foreground">{totalCompletedJobs.toLocaleString()}</p>
            </div>
            <Icon name="Briefcase" size={24} className="text-purple-500" />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Mapa Radnika - Srbija</h3>
          <p className="text-sm text-muted-foreground">
            Prikazuje lokacije svih radnika po celoj Srbiji. Kliknite na marker za detalje.
          </p>
        </div>
        
        <div className="relative" style={{ height: '600px' }}>
          <MapContainer
            center={serbiaCenter}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            maxBounds={serbiaBounds}
            minZoom={6}
            maxZoom={12}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <ZoomControl position="topright" />
            
            {/* Workers Markers */}
            {workers.map((worker) => (
              <Marker
                key={worker.id}
                position={worker.coordinates}
                eventHandlers={{
                  click: () => setSelectedWorker(worker)
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{getCategoryIcon(worker.category)}</span>
                      <div>
                        <h4 className="font-semibold text-foreground">{worker.name}</h4>
                        <p className="text-sm text-muted-foreground">{worker.category}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Grad:</span>
                        <span className="text-foreground">{worker.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ocena:</span>
                        <span className="text-foreground">{worker.rating}/5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Satnica:</span>
                        <span className="text-foreground">€{worker.hourlyRate}/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          worker.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {worker.status === 'active' ? 'Aktivan' : 'Zauzet'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Poslovi:</span>
                        <span className="text-foreground">{worker.completedJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verifikovan:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          worker.verified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {worker.verified ? 'Da' : 'Ne'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Poslednja aktivnost: {new Date(worker.lastActive).toLocaleDateString('sr-RS')}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h4 className="font-medium text-foreground mb-3">Legenda</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">Aktivan</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-muted-foreground">Zauzet</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-muted-foreground">Verifikovan</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span className="text-muted-foreground">Neaktivan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerbiaMapInteractive;
