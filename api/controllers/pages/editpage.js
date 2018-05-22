module.exports = {
  friendlyName: 'Edit page',

  description: 'Shows the edit page',

  inputs: {
    uuid: {
      type: 'string',
      description: "The UUID of the listing to edit.",
      isUUID: true,
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/editlisting'
    }
  },

  fn: async function (inputs, exits) {
    var listing = await Listing.findOne({uuid:inputs.uuid}).populate('creator');
    if(!listing){
      return this.res.notFound();
    }
    else{
      var user = this.req.session.me;
      if(listing.creator.uuid !== user.uuid){
        return this.res.forbidden();
      }
      else{
        return exits.success({listing: listing, backbtn:'/listings/'+listing.uuid});
      }
    }
  }
};