sap.ui.define([], function () {
	"use strict";

	return {
		"sap.app": {
			"id": "",
			"type": "card",
			"title": "Sample of a List with StackedBar Chart",
			"subTitle": "Sample of a List with StackedBar chart",
			"applicationVersion": {
				"version": "1.0.0"
			},
			"shortTitle": "A short title for this Card",
			"info": "Additional information about this Card",
			"description": "A long description for this Card",
			"tags": {
				"keywords": [
					"List",
					"Chart",
					"Card",
					"Sample"
				]
			}
		},
		"sap.ui": {
			"technology": "UI5",
			"icons": {
				"icon": "sap-icon://list"
			}
		},
		"sap.card": {
			"type": "List",
			"header": {
				"title": "Notebooks Distribution",
				"subTitle": "by years",
				"status": {
					"text": "3 of 11"
				}
			},
			"content": {
				"data": {
					"json": {
						"legend": {
							"items": {
								"Notebook13": "Notebook 13",
								"Notebook17": "Notebook 17"
							}
						},
						"maxOverYears": 700,
						"Notebooks": [
							{
								"Year": 2017,
								"Category": "Computer system accessories",
								"Notebook13": 200,
								"Notebook17": 500
							},
							{
								"Year": 2018,
								"Category": "Computer system accessories",
								"Notebook13": 300,
								"Notebook17": 320
							},
							{
								"Year": 2019,
								"Category": "Computer system accessories",
								"Notebook13": 140,
								"Notebook17": 255
							}
						]
					},
					"path": "/Notebooks"
				},
				"maxItems": 3,
				"item": {
					"title": "{Year}",
					"description": "{Category}",
					"chart": {
						"type": "StackedBar",
						"displayValue": "{= ${Notebook13} + ${Notebook17}}K",
						"maxValue": "{/maxOverYears}",
						"bars": [
							{
								"value": "{Notebook13}",
								"displayValue": "{/legend/items/Notebook13}: {Notebook13}K",
								"legendTitle": "{/legend/items/Notebook13}"
							},
							{
								"value": "{Notebook17}",
								"displayValue": "{/legend/items/Notebook17}: {Notebook17}K",
								"legendTitle": "{/legend/items/Notebook17}"
							}
						]
					}
				}
			}
		}
	};
});

