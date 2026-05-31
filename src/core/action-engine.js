// action-engine.js

export function processEvent(event, config) {
  if (!config || !config.actions) return null;

  for (const rule of config.actions) {
    if (matchEvent(event, rule.on)) {
      return buildAction(event, rule.do);
    }
  }

  return null; // no match
}

// ===== MATCHING =====
function matchEvent(event, condition) {
  return (
    event.source === condition.source &&
    event.type === condition.type
  );
}

// ===== ACTION BUILDER =====
function buildAction(event, actionDef) {
  const action = {
    type: actionDef.type,
    target: actionDef.target || null,
    params: {}
  };

  // default mode for navigation
  if (action.type === "navigate") {
    action.mode = actionDef.mode || "same";
  }

  // map payload → params
  if (actionDef.map) {
    for (const [key, path] of Object.entries(actionDef.map)) {
      const value = resolvePath(event, path);
      if (value !== undefined) {
        action.params[key] = value;
      }
    }
  }

  // Special cases
  if (action.type === "clearFilter") {
    action.params = {};
  }

  return action;
}

// ===== SIMPLE PATH RESOLVER =====
function resolvePath(obj, path) {
  // supports: "payload.value"
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}