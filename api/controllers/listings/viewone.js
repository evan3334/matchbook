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
      let listing = await Listing.findOne({uuid: inputs.uuid}).populate('creator');
      listing = await Listing.fillAttributes(listing);
      if (listing == null) {
        return exits.notFound();
      }
      else{
        let owner = false;
        let admin = false;
        if(this.req.session.me && this.req.session.me.uuid === listing.creator.uuid){
          owner = true;
        }
        if(this.req.session.me && this.req.session.me.admin){
          admin = true;
        }

        return exits.success({listing:listing, owner: owner, admin: admin, backbtn: '/listings/'});
      }
    }
    catch(e){
      return exits.error();
    }
  }

};