
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/base/util/UriParameters",
	"sap/ui/core/Core",
	"sap/ui/mdc/p13n/StateUtil",
	"test-resources/sap/ui/mdc/qunit/util/V4ServerHelper",
	"sap/ui/model/odata/v4/ODataModel"
], function(Controller, Fragment, UriParameters, oCore, StateUtil, V4ServerHelper, ODataModel) {
	"use strict";
	return Controller.extend("view.Main", {

		onInit: function () {
			var oParams = UriParameters.fromQuery(location.search);
			var sSubView = oParams.get("view") || "Explicit";

			var mViews = {
				Explicit: "AppUnderTestTable.view.Explicit",
				Implicit: "AppUnderTestTable.view.Implicit",
				Transient: "AppUnderTestTable.view.Transient",
				AutoImplicit: "AppUnderTestTable.view.AutoImplicit",
				State: "AppUnderTestTable.view.State"
			};

			V4ServerHelper.requestServerURLForTenant("MDCTableP13nOpaTestApplication", true).then(function(tenantBaseUrl) {

				var oModel = new ODataModel({
					serviceUrl: tenantBaseUrl + "music/",
					groupId: "$direct",
					autoExpandSelect: true,
					operationMode: "Server"
				 });

				 this.getView().setModel(oModel);
				 this.setFragment(mViews[sSubView]);
			 }.bind(this));
		},

		setFragment: function (sFragment) {
			var oPage = this.getView().byId('FlexTestPage');
			Fragment.load({
				name: sFragment,
				controller: this
			}).then(function name(oFragment) {
				oPage.addContent(oFragment);
			});
		},

		onPressRTA: function() {
			var oOwnerComponent = this.getOwnerComponent();
			oCore.loadLibrary("sap/ui/rta", { async: true }).then(function () {
				sap.ui.require(["sap/ui/rta/api/startKeyUserAdaptation"], function (startKeyUserAdaptation) {
					startKeyUserAdaptation({
						rootControl: oOwnerComponent.getAggregation("rootControl")
					});
				});
			});
		},

		onRetrieveState: function(oEvent) {
			var oControl =  oCore.byId(oEvent.getSource().getId() == "tblRetrieve" ? "IDTableOfInternalSampleApp_01" : "IDFilterBar");
			if (oControl) {
				StateUtil.retrieveExternalState(oControl).then(function(oState) {
					var oOutput = oCore.byId("CEState");
					if (oOutput) {
						oOutput.setValue(JSON.stringify(oState, null, "  "));
					}
				});
			}
		},

		onApplyState: function(oEvt) {
			var oControl =  oCore.byId(oEvt.getSource().getId() == "tblApply" ? "IDTableOfInternalSampleApp_01" : "IDFilterBar");
			var oCE = oCore.byId("CEState");
			var oState;
			if (oCE) {
				oState = JSON.parse(oCE.getValue());
			}
			if (oControl) {
				StateUtil.applyExternalState(oControl, oState).then(function(){

				});
			}
		}

	});
});
