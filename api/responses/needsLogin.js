module.exports = function needsLogin(){

  let req = this.req;
  let res = this.res;
  let attemptedPage = req.path;
  res.redirect('/login?redirect='+encodeURIComponent(attemptedPage))
};