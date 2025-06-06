module.exports.registerPost = (req, res, next) => {
  if(!req.body.fullName) {
    res.json({ message: "Vui lòng nhập họ tên" });
    return;
  }
  if(!req.body.email) {
    res.json({ message: "Vui lòng nhập email" });
    return;
  }
  if(!req.body.password) {
    res.json({ message: "Vui lòng nhập mật khẩu" });
    return;
  }
  next();
}

module.exports.loginPost = (req, res, next) => {
  if(!req.body.email) {
    res.json({ message: "Vui lòng nhập email" });
    return;
  }
  if(!req.body.password) {
    res.json({ message: "Vui lòng nhập mật khẩu" });
    return;
  }
  next();
}

module.exports.forgotPasswordPost = (req, res, next) => {
  if(!req.body.email) {
    res.json({ message: "Vui lòng nhập email" });
    return;
  }
  next();
}

module.exports.resetPasswordPost = (req, res, next) => {
  if(!req.body.password) {
    res.json({ message: "Vui lòng nhập mật khẩu!" });
    return;
  }
  next();
}
