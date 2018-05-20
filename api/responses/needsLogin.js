module.exports = function needsLogin(redirect) {

  let req = this.req;
  let res = this.res;
  let attemptedPage;
  if (typeof redirect === 'string') {
    attemptedPage = redirect;
  } else if (typeof redirect === 'boolean' && !redirect) {
    attemptedPage = '';
  } else {
    attemptedPage = req.originalUrl;
  }
  res.redirect('/login/'+((attemptedPage!=='')?'?redirect=' + encodeURIComponent(attemptedPage):''));
};