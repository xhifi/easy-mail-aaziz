module.exports = (req, res, next) => {
  console.log(
    `${req.method} ${req.ip} ${new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date())} ${req.url} ${res.statusCode}`
  );
  next();
};
