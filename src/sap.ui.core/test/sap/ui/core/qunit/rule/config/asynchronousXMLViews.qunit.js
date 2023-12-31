/*global QUnit*/

sap.ui.define([
	"jquery.sap.global",
	"sap/base/Log",
	"sap/ui/core/Component",
	"sap/ui/core/ComponentContainer",
	"sap/ui/core/mvc/XMLView",
	"sap/ui/layout/VerticalLayout",
	"sap/m/Button",
	"test-resources/sap/ui/support/TestHelper"
], function(
	jQuery,
	Log,
	Component,
	ComponentContainer,
	XMLView,
	VerticalLayout,
	Button,
	testRule
) {
	"use strict";

	QUnit.module("sap.ui.core asynchronousXMLViews rule tests", {
		beforeEach: function() {
			Log.setLevel(4);

			var sViewContent =
				'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m">' +
				'<m:Button text="Button 1" id="button1" />' +
				'</mvc:View>';
			this.oRootControl = new VerticalLayout({
				content: [
					new XMLView({
						id: "asyncView",
						async: true,
						viewContent: sViewContent
					}),
					new XMLView({
						id: "syncView",
						viewContent: sViewContent
					})
				]
			});

			this.pComponent = sap.ui.getCore().createComponent({
				name: "testdata.routing",
				async: true
			});

			this.pComponent.then(function(oComponent) {
				oComponent.getRouter()._oConfig._async = false;
			});

			this.pComponentAsyncConfig = sap.ui.getCore().createComponent({
				name: "testdata.routing",
				async: true
			});

			this.oComponentWithoutRouter = new Component();

		},
		afterEach: function() {
			this.oRootControl.destroy();
			this.pComponent.then(function(oComponent) {
				oComponent.destroy();
			});
			this.pComponentAsyncConfig.then(function(oComponent) {
				oComponent.destroy();
			});
			this.oComponentWithoutRouter.destroy();
		}
	});

	testRule({
		executionScopeType: "global",
		libName: "sap.ui.core",
		ruleId: "asynchronousXMLViews",
		expectedNumberOfIssues: 1
	});
});