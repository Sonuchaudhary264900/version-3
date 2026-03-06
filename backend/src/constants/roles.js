/**
 * Role Constants
 */

const ROLES = Object.freeze({

  USER: "user",

  OWNER: "owner",

  ADMIN: "admin"

});


const ALL_ROLES = Object.values(ROLES);


/* Role groups */

const ADMIN_ROLES = [ROLES.ADMIN];

const OWNER_ROLES = [ROLES.OWNER, ROLES.ADMIN];

const USER_ROLES = [ROLES.USER, ROLES.OWNER, ROLES.ADMIN];


/* Validators */

function isValidRole(role) {

  return ALL_ROLES.includes(role);

}

function isAdmin(role) {

  return ADMIN_ROLES.includes(role);

}

function isOwner(role) {

  return role === ROLES.OWNER;

}

function isUser(role) {

  return role === ROLES.USER;

}


/* Access helpers */

function hasAdminAccess(role) {

  return ADMIN_ROLES.includes(role);

}

function hasOwnerAccess(role) {

  return OWNER_ROLES.includes(role);

}

function hasUserAccess(role) {

  return USER_ROLES.includes(role);

}


module.exports = {

  ROLES,

  ALL_ROLES,

  ADMIN_ROLES,

  OWNER_ROLES,

  USER_ROLES,

  isValidRole,

  isAdmin,

  isOwner,

  isUser,

  hasAdminAccess,

  hasOwnerAccess,

  hasUserAccess

};