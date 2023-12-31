/* global QUnit */

sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/core/LabelEnablement",
	"sap/ui/core/Core",
	"sap/ui/core/ResizeHandler",
	"sap/m/Label",
	"sap/m/Button",
	"sap/m/Link",
	"sap/m/Input",
	"sap/ui/layout/form/Form",
	"sap/ui/layout/form/ColumnLayout",
	"sap/ui/layout/form/FormContainer",
	"sap/ui/layout/form/FormElement",
	"sap/ui/mdc/Field",
	"sap/ui/mdc/field/content/ContentFactory",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function(
	Control,
	LabelEnablement,
	Core,
	ResizeHandler,
	Label,
	Button,
	Link,
	Input,
	Form,
	ColumnLayout,
	FormContainer,
	FormElement,
	Field,
	ContentFactory,
	createAndAppendDiv
) {
	"use strict";

	createAndAppendDiv("content");

	var AnotherTestLabel = Control.extend("AnotherTestLabel", {
		metadata : {
			interfaces : [
				"sap.ui.core.Label"
			],
			properties : {
				required : {type : "boolean", defaultValue : false}
			},
			associations : {
				labelFor : {type : "sap.ui.core.Control", multiple : false}
			}
		},

		renderer: {
			apiVersion: 2,
			render: function(oRm, oCtrl) {
				oRm.openStart("label", oCtrl);
				LabelEnablement.writeLabelForAttribute(oRm, oCtrl);
				oRm.openEnd().close("label");
			}
		}
	});

	var TestLabel = Control.extend("TestLabel", {
		metadata : {
			interfaces : [
				"sap.ui.core.Label"
			],
			properties : {
				required : {type : "boolean", defaultValue : false}
			},
			associations : {
				labelFor : {type : "sap.ui.core.Control", multiple : false}
			}
		},

		renderer: {
			apiVersion: 2,
			render: function(oRm, oCtrl) {
				oRm.openStart("label", oCtrl);
				LabelEnablement.writeLabelForAttribute(oRm, oCtrl);
				oRm.openEnd().close("label");
			}
		}
	});

	LabelEnablement.enrich(TestLabel.prototype);

	var TestControl = Control.extend("TestControl", {
		metadata : {
			associations : {
				ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
			},
			properties : {
				required : {type : "boolean", defaultValue : false}
			}
		},

		renderer: {
			apiVersion: 2,
			render: function(oRm, oCtrl) {
				oRm.openStart("div", oCtrl)
					.accessibilityState(oCtrl, {labelledby : {value: oCtrl.getId() + "-additionalLabel", append: true}})
					.openEnd();
					oRm.openStart("label", oCtrl.getId() + "-additionalLabel")
						.openEnd()
						.close("label");
				oRm.close("div");
			}
		}
	});


	QUnit.module("LabelEnablement", {
		beforeEach : function () {
			this.oLabel = new TestLabel("testLabel");
			this.oControl1 = new TestControl("testControl1", {ariaLabelledBy: "someLabelFromApplication"});
			this.oControl2 = new TestControl("testControl2");

			this.oLabel.placeAt("content");
			this.oControl1.placeAt("content");
			this.oControl2.placeAt("content");
			Core.applyChanges();
		},
		afterEach : function () {
			this.oLabel.destroy();
			this.oLabel = null;
			this.oControl1.destroy();
			this.oControl1 = null;
			this.oControl2.destroy();
			this.oControl2 = null;
		}
	});

	QUnit.test("Initialization", function(assert) {
		assert.throws(function(){
			LabelEnablement.enrich(new TestControl());
		}, "sap.ui.core.LabelEnablement cannot be applied on Controls which does not implement interface sap.ui.core.Label");

		try {
			LabelEnablement.enrich(new AnotherTestLabel());
		} catch (e) {
			assert.ok(false, "sap.ui.core.LabelEnablement can be applied on Controls which implement interface sap.ui.core.Label");
		}
	});

	QUnit.test("No label assignment done", function(assert) {
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl1).length, 0, "No label assigned to control 1");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl2).length, 0, "No label assigned to control 2");
		assert.ok(!this.oLabel.$().attr("for"), "Label has no for attribute");
		assert.strictEqual(this.oControl1.$().attr("aria-labelledby"), "someLabelFromApplication testControl1-additionalLabel", "No aria-labelledby reference to label in control 1");
		assert.strictEqual(this.oControl2.$().attr("aria-labelledby"), "testControl2-additionalLabel", "No aria-labelledby reference to label in control 1");
	});

	QUnit.test("Label assignment done with LabelFor association", function(assert) {
		this.oLabel.setLabelFor(this.oControl1);
		Core.applyChanges();

		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl1).length, 1, "Label assigned to control 1");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl1)[0], "testLabel", "Label assigned to control 1");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl2).length, 0, "No label assigned to control 2");
		assert.strictEqual(this.oLabel.$().attr("for"), "testControl1", "Labels for attribute points to correct control");
		assert.strictEqual(this.oControl1.$().attr("aria-labelledby"), "testLabel someLabelFromApplication testControl1-additionalLabel", "aria-labelledby reference to label in control 1 available");
		assert.strictEqual(this.oControl2.$().attr("aria-labelledby"), "testControl2-additionalLabel", "No aria-labelledby reference to label in control 1");
	});

	QUnit.test("Label assignment done with setAlternativeLabelFor", function(assert) {
		this.oLabel.setAlternativeLabelFor(this.oControl1);
		Core.applyChanges();

		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl1).length, 1, "Label assigned to control 1");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl1)[0], "testLabel", "Label assigned to control 1");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl2).length, 0, "No label assigned to control 2");
		assert.strictEqual(this.oLabel.$().attr("for"), "testControl1", "Labels for attribute points to correct control");
		assert.strictEqual(this.oControl1.$().attr("aria-labelledby"), "testLabel someLabelFromApplication testControl1-additionalLabel", "aria-labelledby reference to label in control 1 available");
		assert.strictEqual(this.oControl2.$().attr("aria-labelledby"), "testControl2-additionalLabel", "No aria-labelledby reference to label in control 1");
	});

	QUnit.test("Label assignment done with LabelFor association and setAlternativeLabelFor - association wins", function(assert) {
		this.oLabel.setLabelFor(this.oControl1);
		this.oLabel.setAlternativeLabelFor(this.oControl2);
		Core.applyChanges();

		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl1).length, 1, "Label assigned to control 1");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl1)[0], "testLabel", "Label assigned to control 1");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl2).length, 0, "No label assigned to control 2");
		assert.strictEqual(this.oLabel.$().attr("for"), "testControl1", "Labels for attribute points to correct control");
		assert.strictEqual(this.oControl1.$().attr("aria-labelledby"), "testLabel someLabelFromApplication testControl1-additionalLabel", "aria-labelledby reference to label in control 1 available");
		assert.strictEqual(this.oControl2.$().attr("aria-labelledby"), "testControl2-additionalLabel", "No aria-labelledby reference to label in control 1");
	});

	QUnit.test("Label assignment change is reflected", function(assert) {
		this.oLabel.setLabelFor(this.oControl1);
		Core.applyChanges();

		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl1).length, 1, "Label assigned to control 1");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl1)[0], "testLabel", "Label assigned to control 1");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl2).length, 0, "No label assigned to control 2");
		assert.strictEqual(this.oLabel.$().attr("for"), "testControl1", "Labels for attribute points to correct control");
		assert.strictEqual(this.oControl1.$().attr("aria-labelledby"), "testLabel someLabelFromApplication testControl1-additionalLabel", "aria-labelledby reference to label in control 1 available");
		assert.strictEqual(this.oControl2.$().attr("aria-labelledby"), "testControl2-additionalLabel", "No aria-labelledby reference to label in control 1");

		this.oLabel.setLabelFor(this.oControl2);
		Core.applyChanges();

		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl1).length, 0, "No label assigned to control 1");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl2).length, 1, "Label assigned to control 2");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl2)[0], "testLabel", "Label assigned to control 2");
		assert.strictEqual(this.oLabel.$().attr("for"), "testControl2", "Labels for attribute points to correct control");
		assert.strictEqual(this.oControl1.$().attr("aria-labelledby"), "someLabelFromApplication testControl1-additionalLabel", "No aria-labelledby reference to label in control 1");
		assert.strictEqual(this.oControl2.$().attr("aria-labelledby"), "testLabel testControl2-additionalLabel", "aria-labelledby reference to label in control 2 available");

		this.oLabel.setLabelFor(null);
		Core.applyChanges();

		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl1).length, 0, "No label assigned to control 1");
		assert.strictEqual(LabelEnablement.getReferencingLabels(this.oControl2).length, 0, "No label assigned to control 2");
		assert.ok(!this.oLabel.$().attr("for"), "Label has no for attribute");
		assert.strictEqual(this.oControl1.$().attr("aria-labelledby"), "someLabelFromApplication testControl1-additionalLabel", "No aria-labelledby reference to label in control 1");
		assert.strictEqual(this.oControl2.$().attr("aria-labelledby"), "testControl2-additionalLabel", "No aria-labelledby reference to label in control 1");
	});

	QUnit.module("Required Propagation", {
		beforeEach : function () {
			this.oLabel = new TestLabel("testLabel");
			this.oControl = new TestControl("testControl");
			this.oLabel.placeAt("content");
			this.oControl.placeAt("content");
			this.oLabel.setLabelFor(this.oControl);
			Core.applyChanges();
		},
		afterEach : function () {
			this.oLabel.destroy();
			this.oLabel = null;
			this.oControl.destroy();
			this.oControl = null;
		}
	});

// BCP 1680118922
	QUnit.test("it should invalidate the associated control only if the required property has changed", function(assert) {

		// arrange
		var fnInvalidateSpy = this.spy(this.oControl, "invalidate");

		// act
		this.oLabel.setRequired(false);

		// assert
		assert.strictEqual(fnInvalidateSpy.callCount, 0);
	});

	QUnit.test("LabelEnablement.isRequired", function(assert) {
		assert.ok(!LabelEnablement.isRequired(this.oControl), "Control not required (own property and label property not set)");

		this.oControl.setRequired(true);
		Core.applyChanges();
		assert.ok(LabelEnablement.isRequired(this.oControl), "Control required (explicitly via own property)");

		this.oControl.setRequired(false);
		Core.applyChanges();
		assert.ok(!LabelEnablement.isRequired(this.oControl), "Control not required (own property and label property not set)");

		this.oLabel.setRequired(true);
		Core.applyChanges();
		assert.ok(LabelEnablement.isRequired(this.oControl), "Control required (implicitly via label property)");

		this.oLabel.setLabelFor(null);
		Core.applyChanges();
		assert.ok(!LabelEnablement.isRequired(this.oControl), "Control not required (own property not set and no label assigned)");
	});

	QUnit.test("aria-required", function(assert) {
		assert.ok(!this.oControl.$().attr("aria-required"), "Control not required (own property and label property not set)");

		this.oControl.setRequired(true);
		Core.applyChanges();
		assert.strictEqual(this.oControl.$().attr("aria-required"), "true", "Control required (explicitly via own property)");

		this.oControl.setRequired(false);
		Core.applyChanges();
		assert.ok(!this.oControl.$().attr("aria-required"), "Control not required (own property and label property not set)");

		this.oLabel.setRequired(true);
		Core.applyChanges();
		assert.strictEqual(this.oControl.$().attr("aria-required"), "true", "Control required (implicitly via label property)");

		this.oLabel.setLabelFor(null);
		Core.applyChanges();
		assert.ok(!this.oControl.$().attr("aria-required"), "Control not required (own property not set and no label assigned)");
	});

	QUnit.module("Label For", {
		beforeEach : function () {
			// Labels referencing controls with labelable HTML elements
			this.oLabel1 = new Label("testLabel1");
			this.oControl1 = new Input("testInput");
			this.oLabel2 = new Label("testLabel2");
			this.oControl2 = new Button("testButton");

			// Label referencing control with non-labelable HTML elements
			this.oLabel3 = new Label("testLabel3");
			this.oControl3 = new Link("testLink");

			this.oLabel1.placeAt("content");
			this.oControl1.placeAt("content");
			this.oLabel2.placeAt("content");
			this.oControl2.placeAt("content");
			this.oLabel3.placeAt("content");
			this.oControl3.placeAt("content");

			this.oLabel1.setLabelFor(this.oControl1);
			this.oLabel2.setLabelFor(this.oControl2);
			this.oLabel3.setLabelFor(this.oControl3);

			Core.applyChanges();
		},
		afterEach : function () {
			this.oLabel1.destroy();
			this.oControl1.destroy();
			this.oLabel2.destroy();
			this.oControl2.destroy();
			this.oLabel3.destroy();
			this.oControl3.destroy();

			this.oLabel1 = null;
			this.oControl1 = null;
			this.oLabel2 = null;
			this.oControl2 = null;
			this.oLabel3 = null;
			this.oControl3 = null;
		}
	});

// Labelable HTML elements are specified in the HTML standard.
	QUnit.test("label 'for' attribute should only reference labelable HTML elements ", function(assert) {
		assert.strictEqual(this.oLabel1.$().attr("for"), "testInput-inner", "Labels for attribute points to correct control");
		assert.strictEqual(this.oLabel2.$().attr("for"), "testButton", "Labels for attribute points to correct control");
		assert.strictEqual(this.oLabel3.$().attr("for"), undefined, "No for attribute for non-labelable elements");
	});

	QUnit.module("Label For", {
		beforeEach : function () {
			var oForm = new Form({
				title: "Form",
				editable: true,
				width: "300px",
				layout: new ColumnLayout(),
				formContainers: [
					new FormContainer({
						formElements: [
							new FormElement({
								label: new Label("lbl1", {text: "Editable"}),
								fields: [
									new Field("fld1", {
										editMode: "Editable",
										value: "Text",
										multipleLines: false
									})
								]
							}),
							new FormElement({
								label: new Label("lbl2", {text: "Display"}),
								fields: [
									new Field("fld2", {
										editMode: "Display",
										value: "Text",
										multipleLines: false
									})
								]
							})
						]
					})
				]
			}).placeAt('content');

			this.oForm = oForm;

			Core.applyChanges();
		},
		afterEach : function () {
			this.oForm.destroy();
		}
	});

	QUnit.test("label is rendered correctly", function(assert) {
		var done = assert.async(),
			oForm = this.oForm,
			fnOriginalCreateContent = ContentFactory.prototype.createContent;

		ContentFactory.prototype.createContent = function () {
			var pResult = fnOriginalCreateContent.apply(this, arguments);

			pResult.then(function (aControls) {
				var oControl = aControls[0];
				if (oControl && oControl.isA("sap.ui.mdc.field.FieldInput")) {
					oControl.addEventDelegate({
						onAfterRendering: function () {
							setTimeout(function () {
								var oLabel1DomRef = oForm.getDomRef().querySelector("#lbl1");
								var oLabel2DomRef = oForm.getDomRef().querySelector("#lbl2");

								var oField1DomRef = oForm.getDomRef().querySelector("#fld1");

								assert.strictEqual(oLabel1DomRef.tagName, "LABEL", "Label is rendered with 'label' tag.");
								assert.strictEqual(oLabel2DomRef.tagName, "SPAN", "Label is rendered with 'span' tag.");

								assert.strictEqual(oLabel1DomRef.getAttribute("for"), oField1DomRef.getAttribute("id") + "-inner-inner", "'for' attribute is correct");
								assert.notOk(oLabel2DomRef.getAttribute("for"), "'for' attribute is not set");
								done();
							}, 300);
						}
					});
				}
			});

			return pResult;
		};
	});
});
