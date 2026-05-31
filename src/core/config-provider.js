// config-provider.js

const configs = {
  Sales: {
    groups: [
      {
        rows: [
          {
            components: [
              { type: "chart" },
              { type: "grid" }
            ]
          }
        ]
      }
    ]
  }
};

export function getDashboardConfig(name) {
  return configs[name] || null;
}