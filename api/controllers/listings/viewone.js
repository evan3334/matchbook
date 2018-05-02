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
      var listing = await Listing.findOne({uuid: inputs.uuid});
      if (listing == null) {
        return exits.notFound();
      }
      else{
        return exits.success({listing:listing});
      }
    }
    catch(e){
      return exits.error();
    }
  }

};