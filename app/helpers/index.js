const json2csv = require("json2csv").parse;

const pageMetaService = async (params, count) => {
  try {
    return {
      pageCount: Math.ceil(count / params?.limit),
      nextPage:
        params?.page >= Math.ceil(count / params?.limit)
          ? null
          : Number(params?.page) + 1,
      pageSize: params?.limit,
      total: count,
      currentPage: Number(params?.page),
    };
  } catch (error) {
    throw Error(error);
  }
};

const sendOTP_to_mobileNumber = async (
  mobileNumber,
  type = "authorizedPerson"
) => {
  if (mobileNumber) {
    return 1234;
  }
  throw new Error("");
};

const sendOTP_to_email = async (params) => {
  if (params.email) {
    return { status: true, otp: "1234" };
  }
  throw new Error("");
};

const errHandle = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const convert_JSON_to_file = async (res, data, params) => {
  let type = params?.type;
  //json data into csv file
  const csvString = json2csv(data?.data);
  if (type == "authorizedPerson") {
    res.setHeader(
      "Content-disposition",
      "attachment; filename=authorizedPerson Export.csv"
    );
  }
  res.set("Content-Type", "text/csv");
  res.status(200).send(csvString);
  return;
};

module.exports = {
  pageMetaService,
  sendOTP_to_mobileNumber,
  sendOTP_to_email,
  errHandle,
  convert_JSON_to_file,
};
