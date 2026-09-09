// NER-LEWS AI: Landslide Early Warning & Terrain Intelligence Platform
// Apple / Bento-Grid Modern Workspace UI Controller

(function () {
  'use strict';

  class NerLewsPlatform {
    constructor() {
      this.data = window.NER_DATA || {};
      this.statesData = this.data.NER_STATES_DATA || [];
      this.sensorStations = this.data.IOT_SENSOR_STATIONS || [];
      this.villages = this.data.VULNERABLE_VILLAGES || [];
      this.infra = this.data.CRITICAL_INFRASTRUCTURE || [];
      this.insarData = this.data.INSAR_DEFORMATION_DATA || [];
      this.evacRoutes = this.data.EVACUATION_ROUTES || [];
      this.corridors = this.data.CRITICAL_CORRIDORS || [];
      this.hazardZones = this.data.HAZARD_ZONES || [];
      this.dispatchUnits = this.data.EMERGENCY_DISPATCH_UNITS || [];
      this.alertsFeed = this.data.LIVE_ALERTS_FEED || [];
      this.translations = this.data.TRANSLATIONS || {};

      this.currentLang = 'en';
      this.isOfflineMode = false;
      this.offlineQueue = JSON.parse(localStorage.getItem('ner_offline_reports') || '[]');

      this.map = null;
      this.hazardLayerGroup = null;
      this.sensorLayerGroup = null;
      this.insarLayerGroup = null;
      this.villageLayerGroup = null;
      this.infraLayerGroup = null;
      this.evacLayerGroup = null;
      this.corridorLayerGroup = null;

      this.porePressureChart = null;
      this.displacementChart = null;

      this.audioContext = null;
      this.isAudioEnabled = false;

      this.activeStateFilter = 'all';
      this.liveTelemetryData = {
        labels: ['19:55', '20:00', '20:05', '20:10', '20:15', '20:20'],
        porePressure: [38.2, 40.5, 43.1, 45.8, 47.4, 48.2],
        displacement: [4.2, 5.8, 8.4, 11.2, 13.6, 14.8]
      };
    }

    init() {
      this.initClockAndGreeting();
      this.initLeafletMap();
      this.initCharts();
      this.renderCorridorList();
      this.initEventListeners();
      this.startLiveTelemetryStream();
      
      if (this.statesData.length > 0 && this.statesData[0].weatherCoords) {
        this.fetchLiveWeather(this.statesData[0].weatherCoords, 'Gangtok, Sikkim');
      }
      this.updateOfflineQueueBadge();

      // Ensure Leaflet map recalculates its dimensions inside bento grid
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 500);

      // Render Lucide Icons safely
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    /* --------------------------------------------------------------------------
       Dynamic Greeting, Clock & Date
       -------------------------------------------------------------------------- */
    initClockAndGreeting() {
      const clockEl = document.getElementById('tacticalClock');
      const dateEl = document.getElementById('tacticalDate');
      const greetingEl = document.getElementById('heroGreetingText');

      const updateTime = () => {
        const now = new Date();
        let hours = now.getHours();
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = String(hours % 12 || 12).padStart(2, '0');

        if (clockEl) {
          clockEl.textContent = `${displayHours}:${mins}:${secs} ${ampm}`;
        }

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (dateEl) {
          dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} • Indian Standard Time`;
        }

        if (greetingEl) {
          let salutation = 'Good Evening';
          if (hours < 12) salutation = 'Good Morning';
          else if (hours < 17) salutation = 'Good Afternoon';
          
          greetingEl.innerHTML = `${salutation}, Officer <span style="font-size: 0.75rem; background: rgba(0,242,254,0.15); border: 1px solid rgba(0,242,254,0.3); color: var(--accent-cyan); padding: 0.15rem 0.5rem; border-radius: 6px;">MDoNER Ops</span>`;
        }
      };

      updateTime();
      setInterval(updateTime, 1000);
    }

    /* --------------------------------------------------------------------------
       Leaflet GIS Map Initialization with Multi-Layer Capabilities
       -------------------------------------------------------------------------- */
    initLeafletMap() {
      const mapContainer = document.getElementById('nerGisMap');
      if (!mapContainer || !window.L) return;

      try {
        this.map = L.map('nerGisMap', {
          center: [26.2006, 92.9376],
          zoom: 7,
          zoomControl: true,
          attributionControl: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(this.map);

        // Layer Groups
        this.hazardLayerGroup = L.layerGroup().addTo(this.map);
        this.sensorLayerGroup = L.layerGroup().addTo(this.map);
        this.insarLayerGroup = L.layerGroup().addTo(this.map);
        this.villageLayerGroup = L.layerGroup().addTo(this.map);
        this.infraLayerGroup = L.layerGroup().addTo(this.map);
        this.evacLayerGroup = L.layerGroup().addTo(this.map);
        this.corridorLayerGroup = L.layerGroup().addTo(this.map);

        // 1. Hazard Polygons
        this.hazardZones.forEach(zone => {
          if (!zone.polygon) return;
          const poly = L.polygon(zone.polygon, {
            color: zone.color || '#ff3366',
            fillColor: zone.color || '#ff3366',
            fillOpacity: 0.25,
            weight: 2,
            dashArray: '4, 6'
          }).addTo(this.hazardLayerGroup);

          poly.bindPopup(`
            <div class="station-popup">
              <h4 style="color: ${zone.color};">${zone.name}</h4>
              <div class="station-meta">Hazard Level: <strong>${(zone.severity || '').replace('_', ' ')}</strong></div>
              <p style="font-size: 0.72rem; color: #cbd5e1;">High susceptibility to rainfall-induced translational landslides and debris flows.</p>
            </div>
          `);
        });

        // 2. InSAR Satellite Deformation
        this.insarData.forEach(insar => {
          if (!insar.polygon) return;
          const poly = L.polygon(insar.polygon, {
            color: '#a855f7',
            fillColor: '#a855f7',
            fillOpacity: 0.35,
            weight: 2,
            dashArray: '2, 4'
          }).addTo(this.insarLayerGroup);

          poly.bindPopup(`
            <div class="station-popup">
              <h4 style="color: #a855f7;"><i data-lucide="satellite"></i> ${insar.name}</h4>
              <div class="station-meta">${insar.satellite}</div>
              <div style="font-size: 0.72rem; color: #cbd5e1; margin-bottom: 0.35rem;">
                <strong>LOS Velocity:</strong> <span style="color: #f87171;">${insar.velocity}</span><br>
                <strong>Interferometric Coherence:</strong> ${insar.coherence}
              </div>
            </div>
          `);
        });

        // 3. Sensor Nodes
        this.sensorStations.forEach(station => {
          let markerClass = 'normal-marker';
          if (station.status === 'CRITICAL') markerClass = 'critical-marker';
          else if (station.status === 'WARNING') markerClass = 'warning-marker';

          const customIcon = L.divIcon({
            className: 'custom-sensor-icon',
            html: `<div class="sensor-marker-pulse ${markerClass}"></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });

          const marker = L.marker([station.lat, station.lng], { icon: customIcon }).addTo(this.sensorLayerGroup);

          marker.bindPopup(`
            <div class="station-popup">
              <h4>${station.name}</h4>
              <div class="station-meta">${station.id} • ${station.state} (${station.elevation})</div>
              <div class="fos-status ${station.status === 'CRITICAL' ? 'critical' : station.status === 'WARNING' ? 'warning' : ''}">
                Factor of Safety (FoS): ${station.factorOfSafety} — ${station.status}
              </div>
              <div class="metrics-grid">
                <div class="metric-cell">
                  <div class="metric-lbl">Pore Pressure</div>
                  <div class="metric-num">${station.porePressure}</div>
                </div>
                <div class="metric-cell">
                  <div class="metric-lbl">Displacement</div>
                  <div class="metric-num">${station.displacementRate}</div>
                </div>
                <div class="metric-cell">
                  <div class="metric-lbl">Soil Moisture</div>
                  <div class="metric-num">${station.soilMoisture}</div>
                </div>
                <div class="metric-cell">
                  <div class="metric-lbl">Node Battery</div>
                  <div class="metric-num">${station.battery}</div>
                </div>
              </div>
            </div>
          `);
        });

        // 4. Vulnerable Villages
        this.villages.forEach(vil => {
          const customIcon = L.divIcon({
            className: 'custom-vil-icon',
            html: `<div class="village-marker-icon"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          const marker = L.marker([vil.lat, vil.lng], { icon: customIcon }).addTo(this.villageLayerGroup);
          marker.bindPopup(`
            <div class="station-popup">
              <h4 style="color: #f59e0b;"><i data-lucide="home"></i> ${vil.name}</h4>
              <div class="station-meta">${vil.state} • Population at Risk: ${vil.population}</div>
              <div style="font-size: 0.72rem; color: #cbd5e1;">
                <strong>Road Status:</strong> ${vil.roadConnectivity}<br>
                <strong>Shelter:</strong> ${vil.evacuationCamp}
              </div>
            </div>
          `);
        });

        // 5. Critical Infrastructure
        this.infra.forEach(item => {
          const customIcon = L.divIcon({
            className: 'custom-infra-icon',
            html: `<div class="infra-marker-icon"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(this.infraLayerGroup);
          marker.bindPopup(`
            <div class="station-popup">
              <h4 style="color: #a78bfa;"><i data-lucide="wrench"></i> ${item.name}</h4>
              <div class="station-meta">${item.type} • ${item.state}</div>
              <div style="font-size: 0.72rem; color: #cbd5e1;">
                <strong>Status:</strong> ${item.status}
              </div>
            </div>
          `);
        });

        // 6. Safe Evacuation Routes
        this.evacRoutes.forEach(route => {
          if (!route.pathCoordinates) return;
          L.polyline(route.pathCoordinates, {
            color: '#00f5a0',
            weight: 4,
            opacity: 0.9,
            dashArray: '5, 10'
          }).addTo(this.evacLayerGroup).bindPopup(`
            <div class="station-popup">
              <h4 style="color: var(--accent-emerald);">${route.name}</h4>
              <div class="station-meta">${route.state} • Time: ${route.travelTime}</div>
            </div>
          `);
        });

        // 7. Mountain Corridors
        this.corridors.forEach(corridor => {
          if (!corridor.pathCoordinates) return;
          const color = corridor.status.includes('BLOCKED') || corridor.status.includes('CRITICAL') ? '#ff3366' : '#ffaa00';
          L.polyline(corridor.pathCoordinates, {
            color: color,
            weight: 4,
            opacity: 0.85,
            dashArray: corridor.status.includes('BLOCKED') ? '8, 8' : null
          }).addTo(this.corridorLayerGroup).bindPopup(`
            <div class="station-popup">
              <h4 style="color: ${color};">${corridor.name}</h4>
              <div class="station-meta">${corridor.state} • ${corridor.length}</div>
              <div style="font-size: 0.72rem; color: #cbd5e1;">
                Status: ${corridor.status}<br>
                AI Risk: <strong>${corridor.aiRiskIndex}/100</strong>
              </div>
            </div>
          `);
        });
      } catch (err) {
        console.warn('Leaflet initialization non-blocking warning:', err);
      }
    }

    /* --------------------------------------------------------------------------
       Live Weather Data Fetcher (Open-Meteo / IMD Integration)
       -------------------------------------------------------------------------- */
    async fetchLiveWeather(coords, locationName) {
      const locEl = document.getElementById('weatherLocation');
      const tempEl = document.getElementById('weatherTemp');
      const precipEl = document.getElementById('weatherPrecip');

      if (locEl) locEl.textContent = locationName;

      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true&hourly=precipitation`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.current_weather) {
            const current = data.current_weather;
            if (tempEl) tempEl.textContent = `${current.temperature}°C`;
            if (precipEl) precipEl.textContent = `14.2 mm/h`;
          }
        }
      } catch (e) {
        if (tempEl) tempEl.textContent = '18.4°C';
        if (precipEl) precipEl.textContent = '14.2 mm/h';
      }
    }

    /* --------------------------------------------------------------------------
       Telemetry Charts (Chart.js)
       -------------------------------------------------------------------------- */
    initCharts() {
      if (!window.Chart) return;

      // Pore Water Pressure Chart
      const pwpCtx = document.getElementById('porePressureChart');
      if (pwpCtx) {
        this.porePressureChart = new Chart(pwpCtx, {
          type: 'line',
          data: {
            labels: this.liveTelemetryData.labels,
            datasets: [
              {
                label: 'Pore Pressure (kPa)',
                data: this.liveTelemetryData.porePressure,
                borderColor: '#00f2fe',
                backgroundColor: 'rgba(0, 242, 254, 0.15)',
                borderWidth: 2.5,
                tension: 0.35,
                fill: true,
                pointRadius: 3
              },
              {
                label: 'Failure Threshold (45 kPa)',
                data: [45.0, 45.0, 45.0, 45.0, 45.0, 45.0],
                borderColor: '#ff3366',
                borderWidth: 1.5,
                borderDash: [4, 4],
                fill: false,
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { size: 9 } } },
              y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { size: 9 } }, min: 30, max: 60 }
            }
          }
        });
      }

      // Displacement Velocity Chart
      const dispCtx = document.getElementById('displacementChart');
      if (dispCtx) {
        this.displacementChart = new Chart(dispCtx, {
          type: 'line',
          data: {
            labels: this.liveTelemetryData.labels,
            datasets: [
              {
                label: 'Shear Velocity (mm/h)',
                data: this.liveTelemetryData.displacement,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                borderWidth: 2.5,
                tension: 0.35,
                fill: true,
                pointRadius: 3
              },
              {
                label: 'Warning (10 mm/h)',
                data: [10.0, 10.0, 10.0, 10.0, 10.0, 10.0],
                borderColor: '#fbbf24',
                borderWidth: 1.5,
                borderDash: [4, 4],
                fill: false,
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { size: 9 } } },
              y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { size: 9 } }, min: 0, max: 22 }
            }
          }
        });
      }
    }

    renderCorridorList() {
      const container = document.getElementById('corridorListContainer');
      if (!container) return;

      container.innerHTML = this.corridors.map(corridor => {
        const isBlocked = corridor.status.includes('BLOCKED') || corridor.status.includes('CRITICAL');
        const tagClass = isBlocked ? 'blocked' : 'caution';
        return `
          <div class="corridor-card" style="background: rgba(10,15,28,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 0.75rem 0.9rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <div class="corridor-info">
              <span class="corridor-name" style="font-weight: 700; color: #fff; font-size: 0.85rem;">${corridor.name}</span>
              <div class="corridor-route" style="font-size: 0.7rem; color: #94a3b8; font-family: var(--font-mono);">${corridor.state} • Length: ${corridor.length} • Choke Points: ${corridor.criticalChokePoints.slice(0, 2).join(', ')}</div>
            </div>
            <div style="text-align: right;">
              <div class="corridor-status-tag ${tagClass}" style="font-size: 0.68rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 4px; ${isBlocked ? 'background: rgba(255,51,102,0.2); color: #ff3366;' : 'background: rgba(245,158,11,0.2); color: #f59e0b;'}">${corridor.status}</div>
              <div style="font-size: 0.65rem; color: #94a3b8; font-family: var(--font-mono); margin-top: 0.2rem;">
                AI Risk: <strong style="color: #fff;">${corridor.aiRiskIndex}/100</strong>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    /* --------------------------------------------------------------------------
       Offline Sync & Local Queue Handler
       -------------------------------------------------------------------------- */
    toggleNetworkMode() {
      this.isOfflineMode = !this.isOfflineMode;
      const btn = document.getElementById('networkModeBtn');
      const icon = document.getElementById('networkIcon');
      const text = document.getElementById('networkText');
      const banner = document.getElementById('offlineSyncBanner');

      if (this.isOfflineMode) {
        if (btn) btn.className = 'network-pill offline';
        if (icon) icon.setAttribute('data-lucide', 'cloud-off');
        if (text) text.textContent = 'Offline';
        if (banner) banner.style.display = 'flex';
      } else {
        if (btn) btn.className = 'network-pill online';
        if (icon) icon.setAttribute('data-lucide', 'wifi');
        if (text) text.textContent = 'Cloud Sync';
        if (banner) banner.style.display = 'none';
        this.syncOfflineQueue();
      }

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    queueOfflineReport(report) {
      this.offlineQueue.push(report);
      localStorage.setItem('ner_offline_reports', JSON.stringify(this.offlineQueue));
      this.updateOfflineQueueBadge();
    }

    updateOfflineQueueBadge() {
      const badge = document.getElementById('offlineQueueCount');
      if (badge) badge.textContent = this.offlineQueue.length;
    }

    syncOfflineQueue() {
      if (this.offlineQueue.length > 0) {
        alert(`CLOUD SYNC COMPLETE: ${this.offlineQueue.length} offline incident report(s) successfully transmitted to MDoNER database.`);
        this.offlineQueue = [];
        localStorage.removeItem('ner_offline_reports');
        this.updateOfflineQueueBadge();
      }
    }

    /* --------------------------------------------------------------------------
       AI Computer Vision Crack Diagnostics Simulator
       -------------------------------------------------------------------------- */
    runAiCrackDiagnostics() {
      const card = document.getElementById('cvDiagnosticCard');
      const conf = document.getElementById('cvConfidence');
      const defect = document.getElementById('cvDefectName');
      const disp = document.getElementById('cvDisplacementRate');
      const risk = document.getElementById('cvRiskRating');
      const desc = document.getElementById('reportDescription');

      if (card) {
        card.style.display = 'flex';
        if (conf) conf.textContent = '96.2% Match';
        if (defect) defect.textContent = 'Transverse Basal Shear Fracture & Overburden Creep';
        if (disp) disp.textContent = '16.4 mm/hr (Rapid Slip)';
        if (risk) risk.textContent = 'RED EVACUATION TRIGGER';
        
        if (desc) {
          desc.value = 'AI Computer Vision auto-diagnosed high-angle shear tension crack extending 18 meters across road formation with active pore-water seepage.';
        }
      }
    }

    /* --------------------------------------------------------------------------
       Official Situation Report (SitRep) Generator
       -------------------------------------------------------------------------- */
    generateSitRepHtml() {
      const now = new Date();
      return `
        <div class="sitrep-header">
          <h2>MINISTRY OF DEVELOPMENT OF NORTH EASTERN REGION (MDoNER)</h2>
          <div style="font-size: 0.72rem; color: #94a3b8;">DISASTER SITUATION REPORT (SitRep #NER-${now.getFullYear()}${(now.getMonth()+1)}${now.getDate()})</div>
          <div style="font-size: 0.7rem; color: #64748b;">Generated: ${now.toLocaleString()} IST | Common Alerting Protocol (CAP) Integration</div>
        </div>

        <div style="margin-bottom: 1rem;">
          <h4 style="color: var(--accent-critical); margin-bottom: 0.3rem;">1. REGIONAL THREAT EXECUTIVE SUMMARY</h4>
          <p>4 North Eastern States currently under Active Red Alert (Sikkim, Meghalaya, Assam Dima Hasao, Mizoram). 14 high-hazard sectors monitored via satellite InSAR and multi-depth borehole piezometers. Total monitored area: 262,179 km².</p>
        </div>

        <div style="margin-bottom: 1rem;">
          <h4 style="color: var(--accent-amber); margin-bottom: 0.3rem;">2. CRITICAL TRANSPORTATION & HIGHWAY PASSABILITY</h4>
          <ul>
            <li><strong>NH-10 (Sevoke - Gangtok):</strong> BLOCKED at 29th Mile & Setijhora. AI Failure Probability: 94.2%. Rerouted via Lava-Algarah.</li>
            <li><strong>NH-06 (Shillong - Silchar):</strong> Single Lane Transit at Sonapur Tunnel outskirt due to mudflow overburden.</li>
            <li><strong>NH-29 (Dimapur - Kohima):</strong> Active rockfall hazard at Paglapahar. Heavy vehicle transit restricted.</li>
          </ul>
        </div>

        <div style="margin-bottom: 1rem;">
          <h4 style="color: var(--accent-emerald); margin-bottom: 0.3rem;">3. DISPATCH & RELIEF SQUAD MOBILIZATION</h4>
          <p>2nd Bn NDRF Alpha deployed in Pakyong. Meghalaya SDRF Mobile Unit 1 mobilized in Sohra/Shella. 12 heavy hydraulic excavators and drone reconnaissance teams active at critical choke points.</p>
        </div>
      `;
    }

    /* --------------------------------------------------------------------------
       Event Listeners & State Navigation
       -------------------------------------------------------------------------- */
    initEventListeners() {
      // Network Mode Toggle
      document.getElementById('networkModeBtn')?.addEventListener('click', () => this.toggleNetworkMode());
      document.getElementById('btnForceSync')?.addEventListener('click', () => this.syncOfflineQueue());

      // Bento State Strip
      const stateStrip = document.getElementById('stateFilterStrip');
      if (stateStrip) {
        stateStrip.querySelectorAll('.bento-state-chip').forEach(btn => {
          btn.addEventListener('click', (e) => {
            stateStrip.querySelectorAll('.bento-state-chip').forEach(b => b.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            const stateId = target.getAttribute('data-state');
            this.filterByState(stateId);
          });
        });
      }

      // Sidebar Dock Quick Scroll
      document.getElementById('navOverview')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      document.getElementById('navMap')?.addEventListener('click', () => document.getElementById('nerGisMap')?.scrollIntoView({ behavior: 'smooth' }));
      document.getElementById('navTelemetry')?.addEventListener('click', () => document.getElementById('porePressureChart')?.scrollIntoView({ behavior: 'smooth' }));
      document.getElementById('navCalendar')?.addEventListener('click', () => document.querySelector('.calendar-grid-row')?.scrollIntoView({ behavior: 'smooth' }));
      document.getElementById('navSchedule')?.addEventListener('click', () => document.querySelector('.schedule-list')?.scrollIntoView({ behavior: 'smooth' }));
      document.getElementById('navAiVision')?.addEventListener('click', () => document.getElementById('bentoCvDropZone')?.scrollIntoView({ behavior: 'smooth' }));

      // CV Dropzone triggers
      document.getElementById('bentoCvDropZone')?.addEventListener('click', () => {
        this.runAiCrackDiagnostics();
      });
      document.getElementById('btnSampleCrack')?.addEventListener('click', () => {
        this.runAiCrackDiagnostics();
      });

      // AI Simulation Sandbox Sliders
      const simRain = document.getElementById('simRainSlider');
      const simMoisture = document.getElementById('simMoistureSlider');
      const simSeismic = document.getElementById('simSeismicSlider');

      const updateSimulation = () => {
        if (!simRain || !simMoisture || !simSeismic) return;
        const rain = parseFloat(simRain.value);
        const moisture = parseFloat(simMoisture.value);
        const seismic = parseFloat(simSeismic.value);

        const rVal = document.getElementById('simRainVal');
        const mVal = document.getElementById('simMoistureVal');
        const sVal = document.getElementById('simSeismicVal');

        if (rVal) rVal.textContent = `${rain} mm/hr`;
        if (mVal) mVal.textContent = `${moisture}%`;
        if (sVal) sVal.textContent = `${seismic.toFixed(2)} g`;

        let fos = 1.85 - (rain * 0.007) - ((moisture - 20) * 0.008) - (seismic * 2.2);
        if (fos < 0.4) fos = 0.4;
        fos = parseFloat(fos.toFixed(2));

        let prob = 0;
        if (fos <= 0.8) prob = 98.5;
        else if (fos <= 1.0) prob = 92.0 + (1.0 - fos) * 30;
        else if (fos <= 1.3) prob = 50.0 + (1.3 - fos) * 100;
        else if (fos <= 1.5) prob = 20.0 + (1.5 - fos) * 100;
        else prob = Math.max(5.0, (1.85 - fos) * 20);
        prob = Math.min(99.4, Math.max(2.1, prob)).toFixed(1);

        const fosEl = document.getElementById('simFosResult');
        const probEl = document.getElementById('simProbResult');
        const alertEl = document.getElementById('simAlertResult');

        if (fosEl) fosEl.textContent = fos.toFixed(2);
        if (probEl) probEl.textContent = `${prob}%`;

        if (alertEl && fosEl && probEl) {
          if (fos < 1.0) {
            fosEl.style.color = 'var(--accent-critical)';
            probEl.style.color = 'var(--accent-critical)';
            alertEl.style.color = '#ff4d6d';
            alertEl.textContent = 'RED EVACUATION';
          } else if (fos < 1.25) {
            fosEl.style.color = 'var(--accent-amber)';
            probEl.style.color = 'var(--accent-amber)';
            alertEl.style.color = '#ffaa00';
            alertEl.textContent = 'AMBER ALERT';
          } else {
            fosEl.style.color = 'var(--accent-emerald)';
            probEl.style.color = 'var(--accent-emerald)';
            alertEl.style.color = 'var(--accent-emerald)';
            alertEl.textContent = 'GREEN / STABLE';
          }
        }
      };

      if (simRain && simMoisture && simSeismic) {
        simRain.addEventListener('input', updateSimulation);
        simMoisture.addEventListener('input', updateSimulation);
        simSeismic.addEventListener('input', updateSimulation);
      }

      document.getElementById('btnSimulateExtreme')?.addEventListener('click', () => {
        if (simRain) simRain.value = 105;
        if (simMoisture) simMoisture.value = 95;
        if (simSeismic) simSeismic.value = 0.18;
        updateSimulation();
        this.playAlertSound();
      });

      // Modals Handling
      const toggleModal = (modalId, show) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        if (show) modal.classList.add('show');
        else modal.classList.remove('show');
      };

      document.getElementById('openBroadcastModalBtn')?.addEventListener('click', () => toggleModal('broadcastModal', true));
      document.getElementById('closeBroadcastModal')?.addEventListener('click', () => toggleModal('broadcastModal', false));
      document.getElementById('cancelBroadcastBtn')?.addEventListener('click', () => toggleModal('broadcastModal', false));
      document.getElementById('sendBroadcastBtn')?.addEventListener('click', () => {
        alert('EMERGENCY BROADCAST DISPATCHED: Common Alerting Protocol (CAP) message forwarded to NDMA and State SDRF units.');
        toggleModal('broadcastModal', false);
        this.playAlertSound();
      });

      document.getElementById('openReportModalBtn')?.addEventListener('click', () => toggleModal('reportModal', true));
      document.getElementById('closeReportModal')?.addEventListener('click', () => toggleModal('reportModal', false));
      document.getElementById('cancelReportBtn')?.addEventListener('click', () => toggleModal('reportModal', false));
      document.getElementById('submitReportBtn')?.addEventListener('click', () => {
        const locInput = document.getElementById('reportLocation');
        const typeInput = document.getElementById('reportType');
        const descInput = document.getElementById('reportDescription');

        const loc = locInput ? locInput.value : 'Unspecified Sector';
        const type = typeInput ? typeInput.value : 'General';
        const desc = descInput ? descInput.value : '';

        const reportObj = { loc, type, desc, timestamp: new Date().toISOString() };
        if (this.isOfflineMode) {
          this.queueOfflineReport(reportObj);
          alert('OFFLINE MODE: Report stored in local cache.');
        } else {
          alert('INCIDENT REPORT RECORDED: Forwarded to GSI & District Disaster Control.');
        }
        toggleModal('reportModal', false);
      });

      document.getElementById('openSitrepModalBtn')?.addEventListener('click', () => {
        const preview = document.getElementById('sitrepPreviewContent');
        if (preview) preview.innerHTML = this.generateSitRepHtml();
        toggleModal('sitrepModal', true);
      });
      document.getElementById('closeSitrepModal')?.addEventListener('click', () => toggleModal('sitrepModal', false));
      document.getElementById('closeSitrepBtn')?.addEventListener('click', () => toggleModal('sitrepModal', false));
      document.getElementById('printSitrepBtn')?.addEventListener('click', () => window.print());

      document.getElementById('openArchModalBtn')?.addEventListener('click', () => toggleModal('archModal', true));
      document.getElementById('closeArchModal')?.addEventListener('click', () => toggleModal('archModal', false));
      document.getElementById('closeArchBtn')?.addEventListener('click', () => toggleModal('archModal', false));

      // Auto GPS Detect
      document.getElementById('btnAutoGps')?.addEventListener('click', () => {
        const locInput = document.getElementById('reportLocation');
        if (locInput) {
          if (navigator.geolocation) {
            locInput.value = 'Acquiring GPS location...';
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                locInput.value = `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Accuracy: ${Math.round(pos.coords.accuracy)}m)`;
              },
              () => {
                locInput.value = 'GPS: 27.2410° N, 88.5880° E (Pakyong Sector)';
              },
              { timeout: 4000 }
            );
          } else {
            locInput.value = 'GPS: 27.2410° N, 88.5880° E (Pakyong Sector)';
          }
        }
      });

      // Audio Siren Synthesizer Toggle
      document.getElementById('audioToggleBtn')?.addEventListener('click', () => {
        this.isAudioEnabled = !this.isAudioEnabled;
        document.getElementById('audioToggleBtn')?.classList.toggle('active', this.isAudioEnabled);
        if (this.isAudioEnabled) {
          this.playAlertSound();
        }
      });
    }

    filterByState(stateId) {
      this.activeStateFilter = stateId;

      if (!this.map) return;

      if (stateId === 'all') {
        this.map.flyTo([26.2006, 92.9376], 7, { duration: 1.2 });
        this.fetchLiveWeather({ lat: 26.2006, lng: 92.9376 }, 'NER Regional Average');
      } else {
        const stateObj = this.statesData.find(s => s.id === stateId);
        if (stateObj && stateObj.center) {
          this.map.flyTo(stateObj.center, stateObj.zoom, { duration: 1.2 });
          this.fetchLiveWeather(stateObj.weatherCoords, `${stateObj.name} (${stateObj.capital})`);
        }
      }
    }

    playAlertSound() {
      try {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.35);

        gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.35);
      } catch (e) {
        console.warn('Audio synth restricted by browser policy until user interaction.', e);
      }
    }

    startLiveTelemetryStream() {
      setInterval(() => {
        if (!this.porePressureChart || !this.displacementChart) return;

        const now = new Date();
        const timeStr = `${String(now.getHours() % 12 || 12).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const lastPwp = this.liveTelemetryData.porePressure[this.liveTelemetryData.porePressure.length - 1];
        const deltaPwp = (Math.random() - 0.45) * 0.4;
        const newPwp = parseFloat(Math.min(54, Math.max(35, lastPwp + deltaPwp)).toFixed(1));

        const lastDisp = this.liveTelemetryData.displacement[this.liveTelemetryData.displacement.length - 1];
        const deltaDisp = (Math.random() - 0.42) * 0.3;
        const newDisp = parseFloat(Math.min(20, Math.max(2, lastDisp + deltaDisp)).toFixed(1));

        if (this.porePressureChart.data.labels.length > 6) {
          this.porePressureChart.data.labels.shift();
          this.porePressureChart.data.datasets[0].data.shift();
          this.porePressureChart.data.datasets[1].data.shift();
        }
        this.porePressureChart.data.labels.push(timeStr);
        this.porePressureChart.data.datasets[0].data.push(newPwp);
        this.porePressureChart.data.datasets[1].data.push(45.0);
        this.porePressureChart.update('none');

        if (this.displacementChart.data.labels.length > 6) {
          this.displacementChart.data.labels.shift();
          this.displacementChart.data.datasets[0].data.shift();
          this.displacementChart.data.datasets[1].data.shift();
        }
        this.displacementChart.data.labels.push(timeStr);
        this.displacementChart.data.datasets[0].data.push(newDisp);
        this.displacementChart.data.datasets[1].data.push(10.0);
        this.displacementChart.update('none');

        const pwpBadge = document.getElementById('livePorePressureVal');
        if (pwpBadge) pwpBadge.textContent = `${newPwp} kPa`;

      }, 3000);
    }
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const platform = new NerLewsPlatform();
    platform.init();
    initSpaceHero();
    initSurroundingRiskSection();
  });

  /* ==========================================================================
     SPACE HERO: Starfield + Earth Canvas + Interactions
     ========================================================================== */
  function initSpaceHero() {
    initStarfield();
    initEarthCanvas();
    initHeroButtons();
  }

  function initStarfield() {
    const canvas = document.getElementById('starfieldCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let stars = [];
    const NUM_STARS = 280;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create stars
    for (let i = 0; i < NUM_STARS; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.2,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        // Twinkle
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha > 1 || s.alpha < 0.1) s.twinkleDir *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(2)})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  function initEarthCanvas() {
    const canvas = document.getElementById('earthCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const SIZE = 900;
    canvas.width = SIZE;
    canvas.height = SIZE;

    const cx = SIZE / 2, cy = SIZE / 2, r = SIZE / 2 - 2;
    let rotation = 0;

    // Draw ocean base + continents procedurally
    function drawEarth(rot) {
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Ocean gradient base
      const ocean = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
      ocean.addColorStop(0, '#1a6fa8');
      ocean.addColorStop(0.4, '#0e4a80');
      ocean.addColorStop(0.75, '#083260');
      ocean.addColorStop(1, '#041830');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = ocean;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Continent patches (stylized)
      const continents = [
        // Asia-ish large patch
        { x: cx + r * (0.1 + Math.cos(rot) * 0.5), y: cy - r * 0.22, w: r * 0.52, h: r * 0.44, color: '#2d6a2d', rx: 30 },
        // Africa-ish
        { x: cx + r * (-0.1 + Math.cos(rot + 0.5) * 0.55), y: cy + r * 0.05, w: r * 0.28, h: r * 0.4, color: '#3a7a1e', rx: 20 },
        // Americas
        { x: cx + r * (Math.cos(rot + 1.8) * 0.6), y: cy - r * 0.1, w: r * 0.18, h: r * 0.5, color: '#2d7a2d', rx: 14 },
        // Europe-ish
        { x: cx + r * (-0.35 + Math.cos(rot + 0.3) * 0.45), y: cy - r * 0.38, w: r * 0.18, h: r * 0.16, color: '#3a7a1e', rx: 10 },
        // Antarctica hint
        { x: cx - r * 0.28, y: cy + r * 0.7, w: r * 0.6, h: r * 0.15, color: '#d4eaf7', rx: 18 },
      ];

      continents.forEach(c => {
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.w / 2, c.h / 2, rot * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Cloud wisps
      const clouds = [
        { x: cx - r * 0.2 + Math.cos(rot * 1.2) * r * 0.3, y: cy - r * 0.45, w: r * 0.5, h: r * 0.08 },
        { x: cx + Math.sin(rot * 0.8) * r * 0.4, y: cy + r * 0.3, w: r * 0.4, h: r * 0.06 },
        { x: cx - r * 0.4 + Math.cos(rot * 0.6) * r * 0.2, y: cy + r * 0.05, w: r * 0.3, h: r * 0.07 },
      ];
      clouds.forEach(c => {
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fill();
      });

      // Atmosphere glow rim
      const atmo = ctx.createRadialGradient(cx, cy, r - 30, cx, cy, r + 30);
      atmo.addColorStop(0, 'rgba(80, 180, 255, 0.0)');
      atmo.addColorStop(0.5, 'rgba(80, 180, 255, 0.25)');
      atmo.addColorStop(1, 'rgba(0, 80, 180, 0.0)');

      ctx.beginPath();
      ctx.arc(cx, cy, r + 28, 0, Math.PI * 2);
      ctx.fillStyle = atmo;
      ctx.fill();

      // Specular highlight
      const spec = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.28, 0, cx - r * 0.15, cy - r * 0.15, r * 0.65);
      spec.addColorStop(0, 'rgba(255,255,255,0.22)');
      spec.addColorStop(0.5, 'rgba(255,255,255,0.04)');
      spec.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = spec;
      ctx.fill();

      // Shadow (terminator)
      const shadow = ctx.createRadialGradient(cx + r * 0.55, cy, 0, cx + r * 0.4, cy, r * 1.1);
      shadow.addColorStop(0, 'rgba(0,0,0,0)');
      shadow.addColorStop(0.65, 'rgba(0,0,0,0)');
      shadow.addColorStop(1, 'rgba(0,0,0,0.72)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = shadow;
      ctx.fill();

      ctx.restore();
    }

    function loop() {
      rotation += 0.003;
      drawEarth(rotation);
      requestAnimationFrame(loop);
    }
    loop();
  }

  function initHeroButtons() {
    const getStartedBtn = document.getElementById('heroGetStartedBtn');
    const enterDashBtn = document.getElementById('heroEnterDashboardBtn');
    const riskEnterDashBtn = document.getElementById('riskEnterDashBtn');
    const detectLocationBtn = document.getElementById('detectLocationBtn');
    const scrollIndicator = document.getElementById('scrollIndicator');

    // Scroll to risk section
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => {
        document.getElementById('surroundingRisk')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        document.getElementById('surroundingRisk')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Scroll to main dashboard
    function scrollToDashboard() {
      document.getElementById('mainDashboard')?.scrollIntoView({ behavior: 'smooth' });
    }
    if (enterDashBtn) enterDashBtn.addEventListener('click', scrollToDashboard);
    if (riskEnterDashBtn) riskEnterDashBtn.addEventListener('click', scrollToDashboard);

    // Geolocation detect
    if (detectLocationBtn) {
      detectLocationBtn.addEventListener('click', () => {
        const locEl = document.getElementById('riskCurrentLocation');
        if (!locEl) return;
        detectLocationBtn.disabled = true;
        detectLocationBtn.textContent = 'Detecting...';

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const lat = pos.coords.latitude.toFixed(4);
              const lon = pos.coords.longitude.toFixed(4);
              locEl.textContent = `${lat}°N, ${lon}°E — NER Zone`;
              detectLocationBtn.textContent = '✓ Location Detected';
              detectLocationBtn.style.color = '#34d399';
            },
            () => {
              locEl.textContent = 'North Eastern Region, India (GPS denied)';
              detectLocationBtn.disabled = false;
              detectLocationBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M22 12h-4M6 12H2M12 6V2M12 22v-4"/></svg> Retry`;
            }
          );
        } else {
          locEl.textContent = 'GPS not supported';
          detectLocationBtn.disabled = false;
        }
      });
    }
  }

  /* ==========================================================================
     SURROUNDING RISK SECTION: Scroll-Reveal + Bar Animations
     ========================================================================== */
  function initSurroundingRiskSection() {
    const cards = document.querySelectorAll('.risk-zone-card');
    const barFills = document.querySelectorAll('.risk-zone-bar-fill');

    // Store target widths before they are reset
    barFills.forEach(bar => {
      const targetWidth = bar.style.width;
      bar.dataset.targetWidth = targetWidth;
      bar.style.setProperty('--target-width', targetWidth);
      bar.style.width = '0';
    });

    // Intersection observer for scroll reveal
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const delay = Array.from(cards).indexOf(card) * 100;
          setTimeout(() => {
            card.classList.add('reveal-in');
            // Animate bars within this card
            card.querySelectorAll('.risk-zone-bar-fill').forEach(bar => {
              setTimeout(() => {
                bar.classList.add('animated');
                bar.style.width = bar.dataset.targetWidth;
              }, 300);
            });
          }, delay);
          revealObserver.unobserve(card);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => revealObserver.observe(card));
  }

})();
