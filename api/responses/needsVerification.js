module.exports = function needsVerification(redirect) {

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
  res.redirect('/account/verify/'+((attemptedPage!=='')?'?redirect=' + encodeURIComponent(attemptedPage):''));
};