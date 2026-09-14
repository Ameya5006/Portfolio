const desktop = process.env.AUDIT_FORM_FACTOR === "desktop";

module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      numberOfRuns: 2,
      settings: desktop
        ? { preset: "desktop" }
        : {
            formFactor: "mobile",
            screenEmulation: {
              mobile: true,
              width: 390,
              height: 844,
              deviceScaleFactor: 2,
              disabled: false
            }
          }
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }]
      }
    },
    upload: {
      target: "temporary-public-storage"
    }
  }
};
