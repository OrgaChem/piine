// This script licensed under the MIT.
// http://orgachem.mit-license.org


/**
 * @fileoverview A web app class for the 'piine'.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('piine.App');

goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.net.WebSocket');
goog.require('piine.View');



/**
 * A web app class for the 'piine'.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
piine.App = function() {
  this.handler_ = this.createHandler();
  this.socket_ = this.createWebSocket();
  this.view_ = this.createView();

  this.attachEvents();

  this.render();
};
goog.inherits(piine.App, goog.events.EventTarget);
goog.addSingletonGetter(piine.App);


/**
 * ID attribute for the piine view element.
 * @type {string}
 * @const
 */
piine.App.VIEW_ID = 'piine-view';


/**
 * View copoment for the app.
 * @type {goog.ui.Control}
 * @private
 */
piine.App.prototype.view_ = null;


/**
 * Web socket receiver for the app.
 * @type {goog.net.WebSocket}
 * @private
 */
piine.App.prototype.socket_ = null;


/**
 * Event handler for the app.
 * @type {goog.events.EventHandler}
 * @private
 */
piine.App.prototype.handler_ = null;


/**
 * Whether events are already attached.
 * @type {boolean}
 * @private
 */
piine.App.prototype.attached_ = false;


/** @override */
piine.App.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.view_.dispose();
  this.socket_.dispose();
  this.handler_.dispose();
};


/**
 * Attaches all events.
 */
piine.App.prototype.attachEvents = function() {
  var socketEvents = goog.net.WebSocket.EventType;

  if (!this.attached_) {
    this.handler_.listen(window, goog.events.EventType.UNLOAD, this.handleUnload);
    this.handler_.listen(this.socket_, socketEvents.MESSAGE, this.handleServerResponse);
    this.handler_.listen(this.socket_, socketEvents.ERROR, this.handleServerError);
    this.attached_ = true;
  }
};


/**
 * Detaches all events.
 */
piine.App.prototype.detachEvents = function() {
  if (this.attached_) {
    this.handler_.removeAll();
    this.attached_ = false;
  }
};


/**
 * Creates a view component.
 * @protected
 */
piine.App.prototype.createView = function() {
  return new piine.View();
};


/**
 * Creates a web socket receivert.
 * @protected
 */
piine.App.prototype.createWebSocket = function() {
  return new goog.net.WebSocket();
};


/**
 * Creates an event handler.
 * @protected
 */
piine.App.prototype.createHandler = function() {
  return new goog.events.EventHandler(this);
};


/**
 * Handles an unload event.
 * @param {goog.events.Event} e The event to handle.
 * @protected
 */
piine.App.prototype.handleUnload = function(e) {
  this.dispose();
};


/**
 * Handles a server response.
 * @param {goog.net.WebSocket.MessageEvent} e The event to handle.
 * @protected
 */
piine.App.prototype.handleServerResponse = function(e) {
  this.view_react();
};


/**
 * Renders the view.
 */
piine.App.prototype.render = function() {
  var viewElem = goog.dom.getElement(piine.App.VIEW_ID);
  this.view_.decorate(viewElem);
};
