const EVENTS = [
  {
    id: 'solar_flare',
    name: 'Solar Flare',
    icon: '☀️',
    description: 'A massive solar flare is heading towards the spacecraft!',
    impact: { protection: -30, science: +10 },
    chance: 0.15,
    requiresAction: 'heat_shield',
    successMessage: 'Heat shield absorbed the radiation! 🔥',
    failureMessage: 'Instruments damaged by radiation!',
  },
  {
    id: 'fuel_leak',
    name: 'Fuel Leak',
    icon: '💧',
    description: 'Small fuel leak detected in propulsion system!',
    impact: { mobility: -40 },
    chance: 0.12,
    requiresAction: 'propulsion',
    successMessage: 'Backup propulsion engaged! 🚀',
    failureMessage: 'Maneuverability reduced!',
  },
  {
    id: 'meteor_shower',
    name: 'Meteor Shower',
    icon: '☄️',
    description: 'Approaching meteor shower! Need protection!',
    impact: { protection: -50 },
    chance: 0.1,
    requiresAction: 'heat_shield',
    successMessage: 'Shield deflected the meteors! 🛡️',
    failureMessage: 'Hull damage detected!',
  },
  {
    id: 'data_bonus',
    name: 'Data Discovery',
    icon: '💎',
    description: 'Unexpected scientific discovery!',
    impact: { science: +25 },
    chance: 0.18,
    requiresAction: null,
    successMessage: 'Scientists are thrilled! 📊',
    failureMessage: '',
  },
  {
    id: 'signal_issue',
    name: 'Signal Interference',
    icon: '📡',
    description: 'Communication signal degraded!',
    impact: { communication: -40 },
    chance: 0.12,
    requiresAction: 'high_gain_antenna',
    successMessage: 'High-gain antenna re-established link! 📶',
    failureMessage: 'Communication loss for 2 hours!',
  },
  {
    id: 'power_surge',
    name: 'Power Surge',
    icon: '⚡',
    description: 'Solar panel power surge detected!',
    impact: { power: +80 },
    chance: 0.1,
    requiresAction: 'solar_panel',
    successMessage: 'Extra power stored successfully! 🔋',
    failureMessage: 'Power system overloaded!',
  },
];

export const generateRandomEvents = (design) => {
  const events = [];
  const hasComponent = (id) => design.componentIds.includes(id);

  EVENTS.forEach((event) => {
    if (Math.random() < event.chance) {
      const prevented = event.requiresAction && hasComponent(event.requiresAction);
      events.push({
        ...event,
        prevented,
        message: prevented ? event.successMessage : event.failureMessage,
      });
    }
  });

  return events;
};

export const applyEventsToMetrics = (metrics, events) => {
  const modified = { ...metrics };

  events.forEach((event) => {
    if (event.prevented) return;
    if (event.impact.protection) modified.protection = (modified.protection || 0) + event.impact.protection;
    if (event.impact.science) modified.science = (modified.science || 0) + event.impact.science;
    if (event.impact.mobility) modified.mobility = (modified.mobility || 0) + event.impact.mobility;
    if (event.impact.communication) modified.communication = (modified.communication || 0) + event.impact.communication;
    if (event.impact.power) modified.power = (modified.power || 0) + event.impact.power;
  });

  return modified;
};
