/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // mailgunDomain: 'transactional-mail.example.com',
  // mailgunSecret: 'key-testkeyb183848139913858e8abd9a3',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …

  //mailgun settings
  mailgun: {
    //these are set with environment variables so I don't check them into version control
    //domain: '',
    //apiKey: ''
  },

  //the address of the website, used when making links for emails
  //don't include "http://" but do include any port numbers if necessary
  siteAddress: 'matchbook.evan.pw'
};
