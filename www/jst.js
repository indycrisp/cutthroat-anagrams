this["JST"] = this["JST"] || {};

this["JST"]["assets/templates/chat_box.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input class=\'chat-input\'></input>\n<div class=\'chat\'></div>\n';

}
return __p
};

this["JST"]["assets/templates/chat_message.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'chat-message\'>\n\t<span class=\'chat-time\'>[' +
((__t = ( hour )) == null ? '' : __t) +
':' +
((__t = ( minute )) == null ? '' : __t) +
':' +
((__t = ( second )) == null ? '' : __t) +
']</span>\n\t<span class=\'chat-username chat-user-color-' +
((__t = ( color )) == null ? '' : __t) +
'\'>' +
((__t = ( username )) == null ? '' : __t) +
'</span>:\n\t<span class=\'chat-message\'>' +
((__t = ( message )) == null ? '' : __t) +
'</span>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/letter.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'player-letter\'>' +
((__t = ( letter )) == null ? '' : __t) +
'</div>\n';

}
return __p
};

this["JST"]["assets/templates/login/lightbox.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'lightbox\'>\n\t<div class=\'lightbox-content\'>\n\t\t' +
((__t = ( contentTemplate() )) == null ? '' : __t) +
'\n\t</div>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/login/login.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'auth-container login-container\'>\n\t<div class=\'header-row\'>\n\t\t<div class=\'auth-title\'>Log in</div>\n\t\t<div class=\'switch switch-to-register\'>Register</div>\n\t</div>\n\t<div class=\'input-row\'>\n\t\t<label for=\'login-username\'>Username</label>\n\t\t<input type=\'text\' class=\'login-username\'></input>\n\t\t<div class=\'validation-error-container\'></div>\n\t</div>\n\t<div class=\'input-row\'>\n\t\t<label for=\'login-password\'>Password</label>\n\t\t<input type=\'password\' class=\'login-password\'></input>\n\t\t<div class=\'validation-error-container\'></div>\n\t</div>\n\t<div class=\'button-row\'>\n\t\t<div class=\'auth-button login-button\'>Play</div>\n\t</div>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/login/register.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'auth-container register-container\'>\n\t<div class=\'header-row\'>\n\t\t<div class=\'auth-title\'>Register</div>\n\t\t<div class=\'switch switch-to-login\'>Log in</div>\n\t</div>\n\t<div class=\'input-row\'>\n\t\t<label for="register-username">Username</label>\n\t\t<input type=\'text\' class=\'register-username\'></input>\n\t\t<div class=\'validation-error-container\'></div>\n\t</div>\n\t<div class=\'input-row\'>\n\t\t<label for="register-password">Password</label>\n\t\t<input type=\'password\' class=\'register-password\'></input>\n\t\t<div class=\'validation-error-container\'></div>\n\t</div>\n\t<div class=\'button-row\'>\n\t\t<div class=\'auth-button register-button\'>Play</div>\n\t</div>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/login/validation_error.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'validation-error\'>' +
((__t = ( message )) == null ? '' : __t) +
'</div>\n';

}
return __p
};

this["JST"]["assets/templates/menu_left.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'countdown\'></div>\n';

}
return __p
};

this["JST"]["assets/templates/menu_right.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="menu-button logout-button">Log out</div>\n';

}
return __p
};

this["JST"]["assets/templates/tile_table.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="menu-button new-game-button ' +
((__t = ( !gameCompleted ? 'menu-button-hidden' : '' )) == null ? '' : __t) +
'">New game</div>\n<div class=\'tiles-table ' +
((__t = ( gameCompleted ? 'blur' : '' )) == null ? '' : __t) +
'\'>\n\t';
 for (var i=0; i<10; i++) { ;
__p += '\n\t\t<div class=\'tile-row\' id=\'tile-row-' +
((__t = ( i )) == null ? '' : __t) +
'\'>\n\t\t\t';
 for (var j=0; j<10; j++) { ;
__p += '\n\t\t\t\t<div class=\'tile\' id=\'tile-' +
((__t = ( i*10 + j )) == null ? '' : __t) +
'\' align=\'center\'></div>\n\t\t\t';
 } ;
__p += '\n\t\t</div>\n\t';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/user_board.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'users users-' +
((__t = ( side )) == null ? '' : __t) +
'\'></div>\n';

}
return __p
};

this["JST"]["assets/templates/user_status.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id=\'user-status-' +
((__t = ( userId )) == null ? '' : __t) +
'\' class=\'user-status status-' +
((__t = ( userStatus )) == null ? '' : __t) +
'\' title="' +
((__t = ( userStatus )) == null ? '' : __t) +
'"></div>\n';

}
return __p
};

this["JST"]["assets/templates/word_container.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'user-word-container\' id=\'user-word-container-' +
((__t = ( userId )) == null ? '' : __t) +
'\'>\n\t<div class=\'user-name-container\'>\n\t\t<div id=\'user-name-' +
((__t = ( userId )) == null ? '' : __t) +
'\' class=\'user-name ' +
((__t = ( userStatus == 'disconnected' ? 'user-name-disconnected' : '' )) == null ? '' : __t) +
'\'>' +
((__t = ( username )) == null ? '' : __t) +
' </div>\n\t\t' +
((__t = ( userStatusTemplate({ userId: userId, userStatus: userStatus }) )) == null ? '' : __t) +
'\n\t\t<div id=\'user-score-' +
((__t = ( userId )) == null ? '' : __t) +
'\' class=\'user-score\'>' +
((__t = ( userScore )) == null ? '' : __t) +
'</div>\n\t</div>\n\t<div class=\'words-container\' id=\'user-' +
((__t = ( userId )) == null ? '' : __t) +
'\'>\n\t\t';
 for (var i=0; i<words.length; i++) { ;
__p += '\n\t\t\t' +
((__t = ( wordTemplate({ word: words[i], noLetters: false }) )) == null ? '' : __t) +
'\n\t\t';
 } ;
__p += '\n\t</div>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/word.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div id=\'player-word-' +
((__t = ( word.id )) == null ? '' : __t) +
'\' class=\'player-word\'>\n\t';
 if (!noLetters) { ;
__p += '\n\t\t';
 for (var i = 0; i < word.word.length; i++) { ;
__p += '\n\t\t\t<div class=\'player-letter\' style=\'left: ' +
((__t = ( i*25 )) == null ? '' : __t) +
'px\'>' +
((__t = ( word.word[i] )) == null ? '' : __t) +
'</div>\n\t\t';
 } ;
__p += '\t\n\t';
 } ;
__p += '\n</div>\n';

}
return __p
};