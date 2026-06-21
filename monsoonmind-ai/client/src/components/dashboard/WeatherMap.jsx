import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import GlassCard from "../ui/GlassCard";

const riskLabel = (risk) => {
  if (!risk) return "No risk check yet";
  if (risk < 35) return "Low risk area";
  if (risk < 65) return "Watch this area";
  return "High risk area";
};

const WeatherMap = ({ recommendation }) => {
  const location = recommendation?.weather?.current?.location;
  const center = location
    ? [location.latitude, location.longitude]
    : [20.5937, 78.9629];
  const risk = recommendation?.risk?.overallRiskScore || 0;
  const color = risk < 35 ? "#0d9488" : risk < 65 ? "#fb7185" : "#e11d48";

  return (
    <GlassCard className="self-start overflow-hidden p-0">
      <div className="flex flex-col gap-3 p-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-skydata-700">
            Farm map
          </p>
          <h3 className="mt-2 text-xl font-extrabold text-slate-950">
            Is this the right location?
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Check that the marker is near your farm area. Use exact coordinates in the form if the city is too broad.
          </p>
        </div>
        <span className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-extrabold leading-none text-slate-700 ring-1 ring-slate-200">
          {riskLabel(risk)}
        </span>
      </div>
      <div className="h-[360px] overflow-hidden rounded-b-2xl">
        <MapContainer center={center} zoom={location ? 9 : 5} scrollWheelZoom={false}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker
            center={center}
            radius={18}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.72
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-bold text-slate-900">
                  {recommendation?.recommendation || "No decision yet"}
                </p>
                <p className="mt-1 text-sm text-slate-600">Risk: {risk || "--"}%</p>
                <p className="mt-1 text-sm text-slate-600">
                  Rainfall gap: {recommendation?.rainfallDeficit ?? "--"}%
                </p>
              </div>
            </Popup>
          </CircleMarker>
        </MapContainer>
      </div>
    </GlassCard>
  );
};

export default WeatherMap;