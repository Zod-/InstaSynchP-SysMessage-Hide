// ==UserScript==
// @name        InstaSynchP SysMessage Hide
// @namespace   InstaSynchP
// @description Hides system messages after a short time to reduce spam in the chat

// @version     1.0.1
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-SysMessage-Hide
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// ==/UserScript==

function SysMessageHide(version) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP SysMessage Hide';
  this.settings = [{
    'label': 'Hide',
    'id': 'sysmessage-hide',
    'type': 'checkbox',
    'default': true,
    'section': ['Chat', 'System Messages']
  }, {
    'label': 'Hide Delay(ms)',
    'id': 'sysmessage-hide-timeout',
    'type': 'int',
    'min': 0,
    'max': 100000,
    'default': 15000,
    'size': 8,
    'section': ['Chat', 'System Messages']
  }];
  this.hideTimeoutIds = [];
}

SysMessageHide.prototype.executeOnce = function () {
  "use strict";
  var th = this;

  events.on(th, 'SettingChange[sysmessage-hide]', function (oldVal, newVal) {
    $('#chat_messages .text-info').parent()[newVal ? 'hide' : 'show']();
    //stop all the outstanding timeouts
    for (var i = 0, len = th.hideTimeoutIds.length; i < len; i += 1) {
      clearTimeout(th.hideTimeoutIds[i]);
    }
    th.hideTimeoutIds = [];
    //scroll to the bottom
    $('#chat_messages').scrollTop($('#chat_messages')[0].scrollHeight);
  });

  events.on(th, 'AddMessage', function (ignore1, ignore2, extraStyles) {
    if (extraStyles !== 'text-info' || !gmc.get('sysmessage-hide')) {
      return;
    }
    var lastMessage, timeoutId;

    lastMessage = $('#chat_messages > :last-child');

    timeoutId = setTimeout(function () {
      lastMessage.hide();
      th.hideTimeoutIds.shift();
    }, gmc.get('sysmessage-hide-timeout'));

    th.hideTimeoutIds.push(timeoutId);
  });
};

/*
button to toggle system messages
SysMessageHide.prototype.preConnect = function() {
	"use strict";
	var th = this;
  <a style="
	position: absolute;
	top: 2px;
	right: 17px;
	cursor: pointer;
	"><img src="http://puu.sh/e1mf9/dd5400a431.png"></a>
	$('#chat-messages').before(
		$('<a>').append(
			$('<img>', {
				src: 'http://puu.sh/e1mf9/dd5400a431.png'
			})
		).css('cursor', 'pointer').css('top', '2px').css('position', 'absolute').css('right', '17px')
		.click(function() {
			gmc.set('sysmessage-hide', !gmc.get('sysmessage-hide'));
			plugins.settings.save();
		})
	);
}*/

window.plugins = window.plugins || {};
window.plugins.sysMessageHide = new SysMessageHide('1.0.1');
