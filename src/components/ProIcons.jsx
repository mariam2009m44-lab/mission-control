import {
  TbSun, TbAtom, TbCamera, TbMicroscope,
  TbTool, TbTemperature, TbAntenna, TbWifi,
  TbRocket, TbShield, TbPlanet, TbMoon,
  TbSatellite, TbTruck, TbRocketOff
} from 'react-icons/tb';
import { GiRingedPlanet, GiSpaceShuttle, GiJetpack } from 'react-icons/gi';

export const ProIcons = {
  solar_panel: TbSun,
  rtg: TbAtom,
  camera: TbCamera,
  spectrometer: TbMicroscope,
  drill: TbTool,
  radiometer: TbTemperature,
  high_gain_antenna: TbAntenna,
  medium_gain_antenna: TbWifi,
  propulsion: TbRocket,
  heat_shield: TbShield,
};

export const ObjectiveIcons = {
  lunar: TbMoon,
  mars: GiRingedPlanet,
  earth: TbPlanet,
};

export const RocketIcons = {
  small: TbRocket,
  medium: GiSpaceShuttle,
  heavy: GiSpaceShuttle,
};

export const SpacecraftTypeIcons = {
  scout: GiJetpack,
  science: TbSatellite,
  hauler: TbTruck,
};
