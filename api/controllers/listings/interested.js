var uuid = require('uuid');

module.exports = {

  friendlyName: 'Send interest message',

  description: 'Send a seller a notification that buyer is interested in their listing.',

  inputs: {
    uuid: {
      description: 'The UUID of the listing in question',
      type: 'string',
      required: true,
      isUUID: true
    },
    message: {
      description: 'The message to send to the seller',
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/interestsent'
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits){
    let user = this.req.session.me;
    try {
      let listing = await Listing.findOne({uuid: inputs.uuid}).populate('creator');
      if(listing){
        let seller = listing.creator;
        if(user && user.verified){
          await sails.helpers.sendInterestEmail(seller.uuid,user.uuid,listing.uuid,inputs.message);
          return exits.success({backbtn:'/listings/'+listing.uuid})
        }
        else {
          return this.res.needsLogin();
        }
      }
      else{
        return this.res.notFound();
      }
    }
    catch(e){
      return this.res.serverError(e);
    }
  }

};