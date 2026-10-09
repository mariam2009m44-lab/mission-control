import { components } from '../data/spacecraft';
import { getRocket } from '../data/rockets';
import { getObjective } from '../data/objectives';

export const calculateMetrics = (design) => {
  let mass = 0;
  let cost = 0;
  let power = 0;
  let science = 0;
  let communication = 0;
  let protection = 0;
  let mobility = 0;

  design.componentIds.forEach((id) => {
    const c = components[id];
    if (!c) return;
    mass += c.mass || 0;
    cost += c.cost || 0;
    power += c.power || 0;
    science += c.science || 0;
    communication += c.communication || 0;
    protection += c.protection || 0;
    mobility += c.mobility || 0;
  });

  const rocket = getRocket(design.rocketId);
  const totalCost = cost + (rocket ? rocket.cost : 0);

  return {
    mass,
    cost: totalCost,
    power,
    science,
    communication,
    protection,
    mobility,
    rocket,
  };
};

export const validateDesign = (metrics, design) => {
  const errors = [];
  const warnings = [];

  if (metrics.rocket && metrics.mass > metrics.rocket.maxPayload) {
    errors.push(
      `Mass (${metrics.mass}kg) exceeds rocket capacity (${metrics.rocket.maxPayload}kg)`
    );
  }

  if (metrics.power < 0) {
    errors.push(`Power deficit: ${Math.abs(metrics.power)}W`);
  } else if (metrics.power < 50) {
    warnings.push(`Low power margin: ${metrics.power}W`);
  }

  if (metrics.cost > 100) {
    errors.push(`Budget exceeded: $${metrics.cost}M / $100M`);
  }

  const objective = getObjective(design.objectiveId);
  if (objective && metrics.science < objective.scienceTarget) {
    warnings.push(
      `Science target low: ${metrics.science}/${objective.scienceTarget}`
    );
  }

  return { errors, warnings, isValid: errors.length === 0 };
};

export const simulateLaunch = (metrics, design) => {
  const validation = validateDesign(metrics, design);

  if (!validation.isValid) {
    return {
      status: 'FAILED',
      score: 0,
      message: 'Design failed pre-launch validation',
      details: validation.errors,
    };
  }

  let score = 0;
  score += metrics.science * 2;
  score += metrics.communication * 0.5;
  score += Math.min(metrics.power, 200) * 0.3;
  score -= metrics.cost * 0.5;

  const reliability = metrics.rocket?.reliability || 0.9;
  const luck = Math.random();

  let status;
  if (luck > reliability) {
    status = 'PARTIAL';
    score *= 0.6;
  } else if (score > 150) {
    status = 'SUCCESS';
  } else if (score > 80) {
    status = 'PARTIAL';
  } else {
    status = 'FAILED';
  }

  return {
    status,
    score: Math.round(score),
    message:
      status === 'SUCCESS'
        ? '🎉 Mission accomplished!'
        : status === 'PARTIAL'
        ? '📊 Partial success'
        : '❌ Mission failed',
    details: [
      `Science: ${metrics.science}`,
      `Communication: ${metrics.communication}`,
      `Power margin: ${metrics.power}W`,
      `Cost: $${metrics.cost}M`,
      `Reliability: ${(reliability * 100).toFixed(0)}%`,
    ],
    warnings: validation.warnings,
  };
};
