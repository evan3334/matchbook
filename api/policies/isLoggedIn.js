module.exports = async function (req, res, proceed) {

  // If `req.me` is set, then we know that this request originated
  // from a logged-in user.  So we can safely proceed to the next policy--
  // or, if this is the last policy, the relevant action.
  // > For more about where `req.me` comes from, check out this app's
  // > custom hook (`api/hooks/custom/index.js`).
  if (req.session.me) {
    if(req.session.me.verified) {
      return proceed();
    }
    else{
      return res.needsVerification();
    }
  }
  else{
    return res.needsLogin();
  }

  //--•
  // Otherwise, this request did not come from a logged-in user.


};
