import type { ComponentType, SVGProps } from "react";
import type { Amenity } from "../lib/booking";
import {
  BedIcon,
  BlanketIcon,
  FirstAidIcon,
  GpsIcon,
  LampIcon,
  LuggageIcon,
  MusicIcon,
  PlugIcon,
  SeatIcon,
  SnowflakeIcon,
  TvIcon,
  WifiIcon,
} from "./icons";

// `short` labels the icon tiles at the top of the bus page; `label` the full amenities list.
export const amenityInfo: Record<
  Amenity,
  { short: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  ac: { short: "AC", label: "Air Conditioning", icon: SnowflakeIcon },
  recliner: { short: "Recliner Seats", label: "Recliner Seats", icon: SeatIcon },
  pushback: { short: "Push-back Seats", label: "Push-back Seats", icon: SeatIcon },
  berth: { short: "Sleeper Berths", label: "Full-length Sleeper Berths", icon: BedIcon },
  wifi: { short: "Wi-Fi", label: "Wi-Fi On Board", icon: WifiIcon },
  tv: { short: "LED TV", label: "LED TV & Entertainment", icon: TvIcon },
  charging: { short: "Charging Point", label: "Charging Points", icon: PlugIcon },
  music: { short: "Music System", label: "Music System", icon: MusicIcon },
  blanket: { short: "Blanket & Pillow", label: "Blankets & Pillows", icon: BlanketIcon },
  "reading-light": { short: "Reading Lights", label: "Reading Lights", icon: LampIcon },
  gps: { short: "GPS Tracking", label: "GPS Live Tracking", icon: GpsIcon },
  "first-aid": { short: "First Aid", label: "First Aid Kit", icon: FirstAidIcon },
  luggage: { short: "Luggage Space", label: "Luggage Space", icon: LuggageIcon },
};
