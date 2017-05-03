/*!
 * ${copyright}
 */

sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"sap/ui/documentation/sdk/model/models",
		"sap/ui/documentation/sdk/controller/ErrorHandler",
		"sap/ui/model/json/JSONModel",
		"sap/ui/documentation/sdk/util/DocumentationRouter",
		"sap/ui/documentation/sdk/controller/util/ConfigUtil"
	], function (UIComponent, Device, models, ErrorHandler, JSONModel, DocumentationRouter, ConfigUtil) {
		"use strict";

		return UIComponent.extend("sap.ui.documentation.sdk.Component", {

			metadata : {
				manifest : "json",
				includes : [
					"css/style.css",
					"css/explored.css",
					"css/titles.css",
					"css/welcome.css",
					"css/landingPage.css",
					"css/headers.css",
					"thirdparty/google-code-prettify/prettify.css",
					"thirdparty/google-code-prettify/prettify.js",
					"thirdparty/google-code-prettify/lang-css.js",
					"css/FeedbackRatingFaces.css"
				]
			},

			/**
			 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
			 * In this method, the device models are set and the router is initialized.
			 * @public
			 * @override
			 */
			init : function () {
				this._oErrorHandler = new ErrorHandler(this);

				// set the device model
				this.setModel(models.createDeviceModel(), "device");

				// set the global tree data
				this.setModel(new JSONModel(), "treeData");

				// call the base component's init function and create the App view
				UIComponent.prototype.init.apply(this, arguments);

				// create the views based on the url/hash
				this.getRouter().initialize();

				// get configuration
				var oConfig = this.getMetadata().getConfig();
				if (oConfig) {
					this.setModel(new JSONModel(oConfig), "config");
				}
			},

			/**
			 * The component is destroyed by UI5 automatically.
			 * In this method, the ListSelector and ErrorHandler are destroyed.
			 * @public
			 * @override
			 */
			destroy : function () {
				this._oErrorHandler.destroy();
				this._oConfigUtil.destroy();
				this._oConfigUtil = null;
				// call the base component's destroy function
				UIComponent.prototype.destroy.apply(this, arguments);
			},

			/**
			 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
			 * design mode class should be set, which influences the size appearance of some controls.
			 * @public
			 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
			 */
			getContentDensityClass : function() {
				if (this._sContentDensityClass === undefined) {
					// check whether FLP has already set the content density class; do nothing in this case
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			},
			getConfigUtil: function() {
				if (!this._oConfigUtil) {
					this._oConfigUtil = new ConfigUtil(this);
				}
				return this._oConfigUtil;
			}
		});

	}
);