module.exports = function (env) {
  const DEV_CONSTANTS = {};

  const LOCAL_CONSTANTS = {};

  const STAGE_CONSTANTS = {};

  const PREPROD_CONSTANTS = {};

  let envType;

  switch (env) {
    case "DEV":
      envType = DEV_CONSTANTS;
      break;

    case "LOCAL":
      envType = LOCAL_CONSTANTS;
      break;

    case "STAGE":
      envType = STAGE_CONSTANTS;
      break;

    case "PREPROD":
      envType = PREPROD_CONSTANTS;
      break;

    default:
      envType = { NA: "NA" };
      break;
  }

  return envType;
};
