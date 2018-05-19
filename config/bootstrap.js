/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  sails.log.debug("Mailgun domain: "+sails.config.custom.mailgun.domain);
  sails.log.debug("Mailgun API Key: "+sails.config.custom.mailgun.apiKey);


  sails.log.debug("");
  sails.log.debug("Setting up expiry TTL for tokens...");
  //set up automatic expiry for tokens
  let db = Token.getDatastore().manager;
  let tokenCollection = await db.collection(Token.tableName);
  await tokenCollection.createIndex({"expires":1},{expireAfterSeconds:0});
  sails.log.debug("Done setting up TTL");

  return done();

};
