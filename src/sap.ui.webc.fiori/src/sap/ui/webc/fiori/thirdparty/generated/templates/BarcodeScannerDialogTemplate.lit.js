sap.ui.define(['sap/ui/webc/common/thirdparty/base/renderer/LitRenderer'], function (litRender) { 'use strict';

	const block0 = (context, tags, suffix) => litRender.html`<${litRender.scopeTag("ui5-dialog", tags, suffix)} stretch class="ui5-barcode-scanner-dialog-root" dir=${litRender.ifDefined(context.effectiveDir)} @ui5-before-open=${litRender.ifDefined(context._startReader)} @ui5-after-close=${litRender.ifDefined(context._resetReader)}><div class="ui5-barcode-scanner-dialog-video-wrapper"><video class="ui5-barcode-scanner-dialog-video"></video></div><div slot="footer" class="ui5-barcode-scanner-dialog-footer"><${litRender.scopeTag("ui5-button", tags, suffix)} design="Transparent" @click=${context._closeDialog}>${litRender.ifDefined(context._cancelButtonText)}</${litRender.scopeTag("ui5-button", tags, suffix)}></div><${litRender.scopeTag("ui5-busy-indicator", tags, suffix)} ?active=${context.loading} size="Large" text="${litRender.ifDefined(context._busyIndicatorText)}" class="ui5-barcode-scanner-dialog-busy"></${litRender.scopeTag("ui5-busy-indicator", tags, suffix)}></${litRender.scopeTag("ui5-dialog", tags, suffix)}>`;

	return block0;

});
