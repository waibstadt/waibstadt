sap.ui.define([], function () {
	"use strict";

	return {
		"_version": "1.17.0",
		"sap.app": {
			"id": "",
			"type": "card",
			"title": "Sample of an Adaptive Card with formatted text",
			"subTitle": "Sample of an Adaptive with formatted text",
			"applicationVersion": {
				"version": "1.0.0"
			},
			"shortTitle": "A short title for this Card",
			"info": "Additional information about this Card",
			"description": "A long description for this Card",
			"tags": {
				"keywords": [
					"Adaptive",
					"Card",
					"Formatted",
					"Markdown",
					"Sample"
				]
			}
		},
		"sap.card": {
			"configuration": {
				"enableMarkdown": true
			},
			"header": {
				"title": "Markdown support",
				"subTitle": "This is a sample of the markdown feature of MS Adaptive Cards.",
				"icon": {
					"src": "sap-icon://text-formatting"
				}
			},
			"type": "AdaptiveCard",
			"content": {
				"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
				"type": "AdaptiveCard",
				"version": "1.2",
				"body": [
					{
						"type": "TextBlock",
						"text": "This is some **bold** text"
					},
					{
						"type": "TextBlock",
						"text": "This is some _italic_ text"
					},
					{
						"type": "TextBlock",
						"text": "- Bullet \r- List \r",
						"wrap": true
					},
					{
						"type": "TextBlock",
						"text": "1. Numbered\r2. List\r",
						"wrap": true
					},
					{
						"type": "TextBlock",
						"text": "Check out [Adaptive Cards](http://adaptivecards.io)"
					}
				]
			}
		}
	};
});