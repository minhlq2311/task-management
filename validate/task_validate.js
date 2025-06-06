module.exports.createPost = (req, res, next) => {
  if(!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề");
    res.redirect("back");
    return;
  }
  if(req.body.title.length < 6) {
    req.flash("error", "Vui lòng nhập tiêu đề dài ít nhất 6 ký tự");
    res.redirect("back");
    return;
  }
  if(!req.body.status || !['initial', 'doing', 'pending', 'finish'].includes(req.body.status)) {
    req.flash("error", "Trạng thái không hợp lệ");
    res.redirect("back");
    return;
  }
  next();
}