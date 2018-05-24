var uuid = require('uuid');

module.exports = {

  friendlyName: 'Edit Existing Listing',

  description: 'Update an existing listing with the given parameters',

  inputs: {
    uuid: {
      description: 'The UUID of the listing to update',
      type: 'string',
      required: true,
      isUUID: true
    },
    title: {
      description: 'The title of the book',
      type: 'string',
      required: true
    },
    isbn: {
      description: 'The ISBN of the book',
      type: 'string',
      custom: function(value){
        return /[0-9]{10}$/.test(value) || /[0-9]{13}$/.test(value);
      },
      required: true
    },
    price: {
      description: 'The price of the book',
      type: 'number',
      custom: function(value){
        return value>0 && ((value*100)%1)===0; //make sure the number is positive and has 2 decimal places max
      },
      required: true
    },
    authors: {
      description: 'The author(s) of the book',
      type: 'string',
      required: true
    },
    publisher: {
      description: 'The publisher of the book',
      type: 'string',
      required: false
    },
    publicationDate: {
      description: 'The publication date of the book',
      type: 'string',
      required: false
    }
  },

  exits: {
    displayListing: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits){
    let user = this.req.session.me;
    let objId = user.id;
    try {
      var listing = await Listing.findOne({uuid: inputs.uuid}).populate('creator');
      if(listing){
        if(listing.creator.uuid === user.uuid || user.admin){
          //parse the authors first
          let authorArray = inputs.authors.split(',');
          authorArray.forEach(function(each, index){
            authorArray[index] = each.trim();
          });

          let attributes = {
            title: inputs.title,
            isbn: inputs.isbn,
            price: inputs.price,
            uuid: inputs.uuid,
            creator: objId,
            authors: authorArray
          };

          if(inputs.publisher){
            attributes.publisher = inputs.publisher;
          }

          if(inputs.publicationDate){
            attributes.publicationDate = new Date(inputs.publicationDate);
          }

          await Listing.update({uuid:inputs.uuid},attributes).fetch();
          return exits.displayListing('/listings/'+inputs.uuid);
        }
        else{
          return this.res.forbidden();
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