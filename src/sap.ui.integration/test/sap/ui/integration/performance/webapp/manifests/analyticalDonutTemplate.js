sap.ui.define([], function () {
	"use strict";

	return {
		"_version": "1.14.0",
		"sap.app": {
			"id": "",
			"type": "card",
			"title": "Sample of a Donut Chart",
			"subTitle": "Sample of a Donut Chart",
			"applicationVersion": {
				"version": "1.0.0"
			},
			"shortTitle": "A short title for this Card",
			"info": "Additional information about this Card",
			"description": "A long description for this Card",
			"tags": {
				"keywords": [
					"Analytical",
					"Sample"
				]
			}
		},
		"sap.ui": {
			"technology": "UI5",
			"icons": {
				"icon": "sap-icon://donut-chart"
			}
		},
		"sap.card": {
			"type": "Analytical",
			"header": {
				"title": "January"
			},
			"content": {
				"chartType": "Donut",
				"chartProperties": {
					"legend": {
						"visible": false
					},
					"plotArea": {
						"dataLabel": {
							"visible": true,
							"showTotal": true
						}
					},
					"title": {
						"visible": false
					}
				},
				"data": {
					"json": {
						"milk": [
							{
								"Store Name": "24-Seven",
								"Revenue": 345292.06,
								"Fat Percentage": "2 Percent"
							},
							{
								"Store Name": "A&A",
								"Revenue": 1564235.29,
								"Fat Percentage": "2 Percent"
							},
							{
								"Store Name": "Alexei's Specialities",
								"Revenue": 1085567.22,
								"Fat Percentage": "2 Percent"
							},
							{
								"Store Name": "24-Seven",
								"Revenue": 82922.07,
								"Fat Percentage": "1 Percent"
							},
							{
								"Store Name": "A&A",
								"Revenue": 157913.07,
								"Fat Percentage": "1 Percent"
							},
							{
								"Store Name": "Alexei's Specialities",
								"Revenue": 245609.486884,
								"Fat Percentage": "1 Percent"
							}
						]
					},
					"path": "/milk"
				},
				"dimensions": [
					{
						"name": "Store Name",
						"value": "{Store Name}"
					}
				],
				"measures": [
					{
						"name": "Revenue",
						"value": "{Revenue}"
					}
				],
				"feeds": [
					{
						"type": "Dimension",
						"uid": "color",
						"values": [
							"Store Name"
						]
					},
					{
						"type": "Measure",
						"uid": "size",
						"values": [
							"Revenue"
						]
					}
				]
			}
		}
	};
});