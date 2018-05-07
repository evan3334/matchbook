module.exports = {
  friendlyName: 'Logout',

  description: 'Logs out of a user account',

  inputs: {
    /*redirect: {
      description: 'The page to redirect to after success. Used when the user is trying to access something that requires login, so the user can start where they left off.',
      required: false,
      type: 'string'
    }*/
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    //if a user's session exists, invalidate it.
    this.req.session.me = null;
    return exits.success('/');
  }
};