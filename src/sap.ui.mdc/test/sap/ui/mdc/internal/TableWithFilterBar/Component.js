sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/mdc/link/FakeFlpConnector",
	"sap/base/util/LoaderExtensions",
	"sap/base/util/UriParameters"
], function (UIComponent, FakeFlpConnector, LoaderExtensions, UriParameters) {
	"use strict";

	var fnLoadManifest = function() {
		var oDefaultManifest = LoaderExtensions.loadResource("sap/ui/v4demo/manifest.json");

		var oUriParams = new UriParameters(window.location.href);
		if (oUriParams.get("service") === "tenant") {
			oDefaultManifest["sap.app"].dataSources.default.uri = "/tenant(mdcmanagedbooks)/catalog-test/";
		}

		return oDefaultManifest;
	};

	return UIComponent.extend("sap.ui.v4demo.Component", {

		metadata: {
			manifest: fnLoadManifest()
		},

		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();

			this.__initFakeFlpConnector();
		},
		__initFakeFlpConnector: function() {
			FakeFlpConnector.enableFakeConnector({
				'FakeFlpSemanticObject': {
					links: [
						{
							action: "action_01",
							intent: self.location.pathname + (self.location.search && self.location.search) + "#/Books/{path: 'ID', targetType: 'raw'}",
							text: "Manage book",
							icon: "/testsuite/test-resources/sap/ui/documentation/sdk/images/HT-1031.jpg",
							description: "{title}",
							tags: [
								"superiorAction"
							]
						},
						{
							action: "action_02",
							intent: self.location.pathname + (self.location.search && self.location.search) + "#/Authors/{path: 'author_ID', targetType: 'raw'}",
							text: "Manage author",
							description: "{author/name}"
						}
					]
				}
			});
		}

	});
});