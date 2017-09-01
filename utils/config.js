const common = {
  // AMPLITUDE_API_KEY: 'XXX',
  // SENTRY_KEY: 'XXX',
};

// Prod
const prod = {
  ...common,
  secondScreen: false,
  muteVideo: false,
  autoplayVideo: true,
  resourcesScreen: false,
  firstLoad: false,
};

// Dev
const dev = {
  ...common,
  secondScreen: true,
  resourcesScreen: false,
  muteVideo: true,
  autoplayVideo: true,
  firstLoad: true,
};

export default prod;
