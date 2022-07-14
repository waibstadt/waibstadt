sap.ui.define([
	"sap/ui/integration/editor/fields/fragment/Controller"
], function(Controller) {
	"use strict";

	var InputController = Controller.extend("card.explorer.designtime.customfield.viz.Input", {
	});

	InputController.prototype.init = function () {
		this._aa = "aa";
	};

	InputController.prototype.handleChange = function (oEvent) {
		//add current change into translation texts
		var oControl = oEvent.getSource();
		var sValue = oControl.getValue();
		this.saveValue(sValue);
	};

	return InputController;
});