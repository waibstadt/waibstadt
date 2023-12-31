sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/odata/type/Currency", // to have it loaded
	"sap/ui/model/odata/type/Decimal", // to have it loaded
	"sap/ui/model/odata/type/Date", // to have it loaded
	"sap/ui/model/odata/type/DateTimeOffset", // to have it loaded
	"sap/ui/model/odata/type/DateTimeWithTimezone", // to have it loaded
	"sap/ui/model/odata/type/Guid", // to have it loaded
	"sap/ui/model/odata/type/Int32", // to have it loaded
	"sap/ui/model/odata/type/String", // to have it loaded
	"sap/ui/model/odata/type/TimeOfDay", // to have it loaded
	"sap/ui/mdc/field/ConditionsType", // as used in XML view
	"sap/ui/mdc/link/FakeFlpConnector",
	"sap/base/util/LoaderExtensions",
	"sap/base/util/UriParameters",
	"sap/m/routing/Router" // make sure Router is loaded
], function (
	UIComponent,
	ODataCurrencyType,
	ODataDecimalType,
	ODataDateType,
	ODataDateTimeOffsetType,
	ODataDateTimeWithTimezoneType,
	ODataGuidType,
	ODataInt32Type,
	ODataStringType,
	ODataTimeOfDayType,
	ConditionsType,
	FakeFlpConnector,
	LoaderExtensions,
	UriParameters,
	Router
) {
	"use strict";

	var fnLoadManifest = function() {
		var oDefaultManifest;
		// TODO: remove this handling after adoption in sapui5.runtime
		try {
			oDefaultManifest = LoaderExtensions.loadResource("sap/ui/v4demo/templateManifest.json");
		} catch (e) {
			if (e.status === "Not Found") {
				oDefaultManifest = LoaderExtensions.loadResource("sap/ui/v4demo/manifest.json");
			}
		}

		var oUriParams = UriParameters.fromQuery(window.location.search);
		if (oUriParams.get("service") === "tenant") {
			var sRandomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			oDefaultManifest["sap.app"].dataSources.default.uri = "/tenant(" + sRandomString + ")/catalog-test/";
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
