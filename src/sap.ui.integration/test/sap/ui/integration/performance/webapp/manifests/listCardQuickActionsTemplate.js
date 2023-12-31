sap.ui.define([], function () {
	"use strict";

	return {
		"sap.app": {
			"type": "card",
			"id": ""
		},
		"sap.card": {
			"extension": "./extensions/QuickActionsExtension",
			"type": "List",
			"data": {
				"extension": {
					"method": "getData"
				}
			},
			"header": {
				"title": "List Card with Products",
				"subTitle": "The Top Sellers This Month",
				"status": {
					"text": {
						"format": {
							"translationKey": "i18n>CARD.COUNT_X_OF_Y",
							"parts": [
								"parameters>/visibleItems",
								"/count"
							]
						}
					}
				},
				"icon": {
					"src": "sap-icon://desktop-mobile"
				}
			},
			"content": {
				"data": {
					"path": "/products"
				},
				"item": {
					"title": "{Name}",
					"description": "{Description}",
					"info": {
						"value":  "{= format.currency(${Price}, ${CurrencyCode})}"
					},
					"actionsStrip": [
						{
							"text": "Add to Favorites",
							"actions": [
								{
									"type": "Custom",
									"parameters": {
										"method": "addToFavorites",
										"id": "{Id}"
									}
								}
							]
						},
						{
							"buttonType": "Transparent",
							"text": "Remove",
							"actions": [
								{
									"type": "Custom",
									"parameters": {
										"method": "remove",
										"id": "{Id}"
									}
								}
							]
						}
					]
				},
				"maxItems": 3
			}
		}
	};
});
