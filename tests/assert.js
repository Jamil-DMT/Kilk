export function deepEqual(a, b) {
  return JSON.stringify(sortObject(a)) === JSON.stringify(sortObject(b));
}

function sortObject(obj) {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) return obj.map(sortObject);

  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = sortObject(obj[key]);
      return result;
    }, {});
}

export function assertEqual(actual, expected, message) {
  if (!deepEqual(actual, expected)) {
    console.error("❌ FAIL:", message);
    console.log("Expected:", expected);
    console.log("Actual:", actual);
    process.exitCode = 1; // ✅ important for CI
  } else {
    console.log("✅ PASS:", message);
  }
}