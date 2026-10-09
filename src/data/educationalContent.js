export const content = {
  solar_panel: {
    name: 'Solar Panels',
    fullName: 'Photovoltaic Solar Arrays',
    description:
      'Convert sunlight into electricity using photovoltaic cells made of silicon.',
    purpose: 'Main power source for most spacecraft near the Sun.',
    fact:
      'The ISS solar arrays cover an area larger than a football field — 2,500 m²!',
    realExample: 'Used on: ISS, Hubble Space Telescope, Juno',
    difficulty: 'Basic',
  },
  rtg: {
    name: 'RTG',
    fullName: 'Radioisotope Thermoelectric Generator',
    description:
      'Converts heat from radioactive decay (plutonium-238) into electricity using thermocouples.',
    purpose: 'Powers missions far from the Sun where solar panels are weak.',
    fact:
      'The Voyager 1 RTG still works after 45+ years in space — beyond our solar system!',
    realExample: 'Used on: Voyager 1 & 2, Curiosity, Perseverance, New Horizons',
    difficulty: 'Advanced',
  },
  camera: {
    name: 'High-Res Camera',
    fullName: 'High-Resolution Imaging System',
    description:
      'Captures detailed images using CCD/CMOS sensors with long focal length optics.',
    purpose: 'Visual documentation, mapping, and geological surveys.',
    fact:
      'Perseverance has 23 cameras — more than any Mars rover before it!',
    realExample: 'Used on: Hubble, Perseverance, James Webb',
    difficulty: 'Basic',
  },
  spectrometer: {
    name: 'Spectrometer',
    fullName: 'Mass/UV/IR Spectrometer',
    description:
      'Analyzes light or particles to identify chemical composition and physical properties.',
    purpose: 'Detect water, minerals, and organic molecules.',
    fact:
      'Spectrometers can detect a single molecule in a trillion — like finding one drop in 20 Olympic pools!',
    realExample: 'Used on: Curiosity (SAM), New Horizons (Alice)',
    difficulty: 'Intermediate',
  },
  drill: {
    name: 'Sample Drill',
    fullName: 'Subsurface Sampling Drill',
    description:
      'Mechanically bores into rock or soil to collect core samples from below the surface.',
    purpose: 'Reach material protected from surface radiation.',
    fact:
      'Perseverance can drill 70mm deep and stores samples for future return to Earth.',
    realExample: 'Used on: Perseverance, Rosetta (Philae), Chang\'e 5',
    difficulty: 'Advanced',
  },
  radiometer: {
    name: 'Radiometer',
    fullName: 'Microwave Radiometer',
    description:
      'Measures electromagnetic radiation (temperature, moisture, etc.) at specific wavelengths.',
    purpose: 'Study climate, ocean temperature, and atmospheric composition.',
    fact:
      'Radiometers on satellites track Earth\'s weather 24/7 — hurricanes, droughts, and El Niño.',
    realExample: 'Used on: SMAP, Aqua, Jason-3',
    difficulty: 'Intermediate',
  },
  high_gain_antenna: {
    name: 'High-Gain Antenna',
    fullName: 'High-Gain Parabolic Antenna',
    description:
      'Focused directional dish that transmits data back to Earth at high bandwidth.',
    purpose: 'Send large amounts of science data over interplanetary distances.',
    fact:
      'Voyager 1\'s signal reaches Earth at 0.000000000000000000001 watts — but we still hear it!',
    realExample: 'Used on: Voyager, New Horizons, Mars Reconnaissance Orbiter',
    difficulty: 'Intermediate',
  },
  medium_gain_antenna: {
    name: 'Medium-Gain Antenna',
    fullName: 'Medium-Gain Antenna',
    description:
      'Moderate-bandwidth antenna for near-Earth communication and backup links.',
    purpose: 'Communicate when high-gain antenna is not aimed correctly.',
    fact:
      'Most spacecraft have 2-3 antennas as backups in case one fails.',
    realExample: 'Used on: Almost all Mars missions',
    difficulty: 'Basic',
  },
  propulsion: {
    name: 'Propulsion System',
    fullName: 'Chemical/Ion Propulsion System',
    description:
      'Uses thrusters and propellant to change trajectory, orbit, and orientation.',
    purpose: 'Navigate to target, adjust orbit, and land safely.',
    fact:
      'Dawn spacecraft used ion propulsion to orbit TWO different asteroids — an engineering first!',
    realExample: 'Used on: Dawn, Hayabusa2, Psyche',
    difficulty: 'Advanced',
  },
  heat_shield: {
    name: 'Heat Shield',
    fullName: 'Ablative Thermal Protection System',
    description:
      'Protects spacecraft from extreme heat during atmospheric entry (up to 2,700°C).',
    purpose: 'Survive atmospheric entry and protect instruments.',
    fact:
      'Perseverance\'s heat shield generated 2,000°C — hot enough to melt steel!',
    realExample: 'Used on: All Mars landers, Apollo, Stardust',
    difficulty: 'Advanced',
  },
};

export const getContent = (id) => content[id];
