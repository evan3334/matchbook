module.exports = {

  friendlyName: 'Show one listing',

  description: 'Show one listing given its UUID.',

  inputs: {
    uuid:{
      description:"The UUID of the listing to display",
      required:true,
      type:'string',
      isUUID:true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/listingsingle'
    },
    notFound: {
      description: 'Could not find listing by that UUID.',
      statusCode: 404
    },
    error: {
      description: 'Something went wrong on our end.',
      statusCode: 500
    }
  },

  fn: async function (inputs, exits){
    try {
      var listing = await Listing.findOne({uuid: inputs.uuid}).populate('creator');
      if (listing == null) {
        return exits.notFound();
      }
      else{
        var owner = false;
        if(this.req.session.me && this.req.session.me.uuid === listing.creator.uuid){
          owner = true;
        }
        return exits.success({listing:listing, owner: owner});
      }
    }
    catch(e){
      return exits.error();
    }
  }

};