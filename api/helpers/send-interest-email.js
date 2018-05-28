const mailgun = require('mailgun-js');
module.exports = {
  friendlyName: 'Send Interest Email',

  description: 'Send an email to a user to notify them a buyer is interested in their listing',

  inputs: {
    userUUID: {
      type: 'string',
      description: 'the UUID of the user you would like to send an email to',
      required: true,
      isUUID: true
    },
    buyerUUID: {
      type: 'string',
      description: 'the UUID of the buyer',
      required: true,
      isUUID: true
    },
    listingUUID: {
      type: 'string',
      description: 'the UUID of the listing you would like to notify the user about',
      required: true,
      isUUID: true
    },
    message: {
      type: 'string',
      description: 'the user-entered message to send to this user',
      required: true
    }
  },

  exits: {
    userDoesNotExist: {
      description: 'The specified UUID does not point to an existing user.'
    },
    buyerDoesNotExist: {
      description: 'The specified UUID does not point to an existing user.'
    },
    listingDoesNotExist: {
      description: 'The specified UUID does not point to an existing listing.'
    },
    emailError: {
      description: 'Some error occurred sending an email.'
    }
  },

  fn: async function (inputs, exits) {
    let user = await User.findOne({uuid: inputs.userUUID});
    if (user) {
      //user exists, let's check if the buyer exists
      let buyer = await User.findOne({uuid: inputs.buyerUUID});
      if (buyer) {
        //buyer exists, let's check if the listing exists
        let listing = await Listing.findOne({uuid: inputs.listingUUID});
        if (listing) {
          //cool, everything exists. time to construct the email.
          let mailgunClient = new mailgun({
            apiKey: sails.config.custom.mailgun.apiKey,
            domain: sails.config.custom.mailgun.domain
          });
          let link = sails.config.custom.siteAddress + '/login/?redirect=' + encodeURIComponent('/listings/' + listing.uuid);
          let message = {
            from: 'Matchbook <no-reply@' + sails.config.custom.mailgun.domain + '>',
            to: user.email,
            subject: 'A buyer is interested in "' + listing.title + '"',
            html: '<p style="font-family: sans-serif; font-size: 1em;">\n' +
            'Hey, ' + user.name + ', <b>'+buyer.name+'</b> is interested in buying your copy of <i>'+listing.title+'</i> that you listed on Matchbook.'+
            '</p>\n' +
            '<p style="font-family: sans-serif; font-size: 1em;">' +
            'The listing in question can be viewed <a href="'+link+'">here.</a>' +
            '</p>\n' +
            '<p style="font-family: sans-serif; font-size: 1em;margin-bottom: 5px;">' +
            'The buyer writes:' +
            '</p>' +
            '<p style="font-family: monospace; font-size:1em;">' +
            inputs.message.replace(new RegExp('\n','g'),'<br>') +
            '</p>' +
            '<p style="font-family: sans-serif; font-size: 1em;">' +
            'You can contact ' + buyer.name + ' at <a href="mailto:'+buyer.email+'">'+buyer.email+'</a> to negotiate a sale. If you do not wish to talk to this buyer, you can simply ignore this message.'+
            '</p>'
          };

          try {
            await mailgunClient.messages().send(message);
            return exits.success();
          } catch (e) {
            return exits.emailError(e);
          }
        }
        else {
          return exits.listingDoesNotExist();
        }
      }
      else {
        return exits.buyerDoesNotExist();
      }
    }
    else {
      return exits.userDoesNotExist();
    }
  }
};