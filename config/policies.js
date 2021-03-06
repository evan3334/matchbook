/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  'pages/*':true,
  'pages/createpage':'isLoggedIn',
  'listings/create':'isLoggedIn',
  'pages/editpage':'isLoggedIn',
  'listings/edit':'isLoggedIn',
  'pages/deletepage':'isLoggedIn',
  'listings/delete':'isLoggedIn',
  'listings/interested':'isLoggedIn',
  'pages/interestedpage':'isLoggedIn'
  //'pages/verifypage':'isLoggedIn'
};
