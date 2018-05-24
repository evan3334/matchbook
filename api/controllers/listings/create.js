var uuid = require('uuid');

module.exports = {

  friendlyName: 'Create New Listing',

  description: 'Create a new listing with the given parameters',

  inputs: {
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
    },
    error: {
      description: 'Something went wrong on our end.',
      statusCode: 500
    }
  },

  fn: async function (inputs, exits){
    let user = this.req.session.me;
    let objId = user.id;
    try {
      //parse the authors first
      let authorArray = inputs.authors.split(',');
      authorArray.forEach(function(each, index){
        authorArray[index] = each.trim();
      });

      let attributes = {
        title: inputs.title,
        isbn: inputs.isbn,
        price: inputs.price,
        uuid: uuid.v4(),
        creator: objId,
        authors: authorArray
      };

      if(inputs.publisher){
        attributes.publisher = inputs.publisher;
      }

      if(inputs.publicationDate){
        attributes.publicationDate = new Date(inputs.publicationDate);
      }

      let listing = await Listing.create(attributes).fetch();
      return exits.displayListing("/listings/"+listing.uuid);
    }
    catch(e){
      return exits.error();
    }
  }

};