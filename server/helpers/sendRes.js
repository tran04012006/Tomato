const sendRes = (res, statusCode, message, data) => {
  let success = false;
  if (statusCode >= 200 && statusCode < 300) success = true;
  return res.status(statusCode).json({
    success: success,
    message: message,
    data: data,
  });
};

export default sendRes;
