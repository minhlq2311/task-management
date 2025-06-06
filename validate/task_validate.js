module.exports.createPost = (req, res, next) => {
  if(!req.body.title) {
    return res.status(400).json({ message: "Vui lòng nhập tiêu đề" });
  }
  if(req.body.title.length < 6) {
    return res.status(400).json({ message: "Vui lòng nhập tiêu đề dài ít nhất 6 ký tự" });
  }
  if(!req.body.status || !['initial', 'doing', 'pending', 'finish'].includes(req.body.status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }
  next();
}

module.exports.updatePost = (req, res, next) => {
  if(!req.body.status || !['initial', 'doing', 'pending', 'finish'].includes(req.body.status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }
  next();
}