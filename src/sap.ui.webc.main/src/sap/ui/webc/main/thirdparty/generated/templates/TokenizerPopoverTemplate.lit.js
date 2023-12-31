sap.ui.define(["exports", "sap/ui/webc/common/thirdparty/base/renderer/LitRenderer"], function (_exports, _LitRenderer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  /* eslint no-unused-vars: 0 */

  function block0(context, tags, suffix) {
    return suffix ? (0, _LitRenderer.html)`<${(0, _LitRenderer.scopeTag)("ui5-responsive-popover", tags, suffix)} tokenizer-popover="true" style=${(0, _LitRenderer.styleMap)(this.styles.popover)} ?content-only-on-desktop="${this.hasValueState}" hide-arrow placement-type="Bottom" horizontal-align="Left"><div slot="header" class="ui5-responsive-popover-header" style="${(0, _LitRenderer.styleMap)(this.styles.popoverHeader)}">${this._isPhone ? block1.call(this, context, tags, suffix) : undefined}${!this.hasValueState ? block2.call(this, context, tags, suffix) : undefined}</div><${(0, _LitRenderer.scopeTag)("ui5-list", tags, suffix)} class="ui5-tokenizer-list" mode="Delete" @ui5-item-delete=${(0, _LitRenderer.ifDefined)(this.itemDelete)}>${(0, _LitRenderer.repeat)(this._tokens, (item, index) => item._id || index, (item, index) => block4.call(this, context, tags, suffix, item, index))}</${(0, _LitRenderer.scopeTag)("ui5-list", tags, suffix)}>${this._isPhone ? block5.call(this, context, tags, suffix) : undefined}</${(0, _LitRenderer.scopeTag)("ui5-responsive-popover", tags, suffix)}>` : (0, _LitRenderer.html)`<ui5-responsive-popover tokenizer-popover="true" style=${(0, _LitRenderer.styleMap)(this.styles.popover)} ?content-only-on-desktop="${this.hasValueState}" hide-arrow placement-type="Bottom" horizontal-align="Left"><div slot="header" class="ui5-responsive-popover-header" style="${(0, _LitRenderer.styleMap)(this.styles.popoverHeader)}">${this._isPhone ? block1.call(this, context, tags, suffix) : undefined}${!this.hasValueState ? block2.call(this, context, tags, suffix) : undefined}</div><ui5-list class="ui5-tokenizer-list" mode="Delete" @ui5-item-delete=${(0, _LitRenderer.ifDefined)(this.itemDelete)}>${(0, _LitRenderer.repeat)(this._tokens, (item, index) => item._id || index, (item, index) => block4.call(this, context, tags, suffix, item, index))}</ui5-list>${this._isPhone ? block5.call(this, context, tags, suffix) : undefined}</ui5-responsive-popover>`;
  }
  function block1(context, tags, suffix) {
    return suffix ? (0, _LitRenderer.html)`<div class="row" style="${(0, _LitRenderer.styleMap)(this.styles.popoverHeaderTitle)}"><${(0, _LitRenderer.scopeTag)("ui5-title", tags, suffix)} level="H5" class="ui5-responsive-popover-header-text">${(0, _LitRenderer.ifDefined)(this.morePopoverTitle)}</${(0, _LitRenderer.scopeTag)("ui5-title", tags, suffix)}><${(0, _LitRenderer.scopeTag)("ui5-button", tags, suffix)} class="ui5-responsive-popover-close-btn" icon="decline" design="Transparent" @click="${this.closeMorePopover}"></${(0, _LitRenderer.scopeTag)("ui5-button", tags, suffix)}></div>` : (0, _LitRenderer.html)`<div class="row" style="${(0, _LitRenderer.styleMap)(this.styles.popoverHeaderTitle)}"><ui5-title level="H5" class="ui5-responsive-popover-header-text">${(0, _LitRenderer.ifDefined)(this.morePopoverTitle)}</ui5-title><ui5-button class="ui5-responsive-popover-close-btn" icon="decline" design="Transparent" @click="${this.closeMorePopover}"></ui5-button></div>`;
  }
  function block2(context, tags, suffix) {
    return suffix ? (0, _LitRenderer.html)`<div class="${(0, _LitRenderer.classMap)(this.classes.popoverValueState)}" style="${(0, _LitRenderer.styleMap)(this.styles.popoverValueStateMessage)}"><${(0, _LitRenderer.scopeTag)("ui5-icon", tags, suffix)} class="ui5-input-value-state-message-icon" name="${(0, _LitRenderer.ifDefined)(this._valueStateMessageIcon)}"></${(0, _LitRenderer.scopeTag)("ui5-icon", tags, suffix)}>${(0, _LitRenderer.repeat)(this.valueStateMessageText, (item, index) => item._id || index, (item, index) => block3.call(this, context, tags, suffix, item, index))}</div>` : (0, _LitRenderer.html)`<div class="${(0, _LitRenderer.classMap)(this.classes.popoverValueState)}" style="${(0, _LitRenderer.styleMap)(this.styles.popoverValueStateMessage)}"><ui5-icon class="ui5-input-value-state-message-icon" name="${(0, _LitRenderer.ifDefined)(this._valueStateMessageIcon)}"></ui5-icon>${(0, _LitRenderer.repeat)(this.valueStateMessageText, (item, index) => item._id || index, (item, index) => block3.call(this, context, tags, suffix, item, index))}</div>`;
  }
  function block3(context, tags, suffix, item, index) {
    return (0, _LitRenderer.html)`${(0, _LitRenderer.ifDefined)(item)}`;
  }
  function block4(context, tags, suffix, item, index) {
    return suffix ? (0, _LitRenderer.html)`<${(0, _LitRenderer.scopeTag)("ui5-li", tags, suffix)} .tokenRef=${(0, _LitRenderer.ifDefined)(item)}>${(0, _LitRenderer.ifDefined)(item.text)}</${(0, _LitRenderer.scopeTag)("ui5-li", tags, suffix)}>` : (0, _LitRenderer.html)`<ui5-li .tokenRef=${(0, _LitRenderer.ifDefined)(item)}>${(0, _LitRenderer.ifDefined)(item.text)}</ui5-li>`;
  }
  function block5(context, tags, suffix) {
    return suffix ? (0, _LitRenderer.html)`<div slot="footer" class="ui5-responsive-popover-footer"><${(0, _LitRenderer.scopeTag)("ui5-button", tags, suffix)} design="Transparent" @click="${this.closeMorePopover}">OK</${(0, _LitRenderer.scopeTag)("ui5-button", tags, suffix)}></div>` : (0, _LitRenderer.html)`<div slot="footer" class="ui5-responsive-popover-footer"><ui5-button design="Transparent" @click="${this.closeMorePopover}">OK</ui5-button></div>`;
  }
  var _default = block0;
  _exports.default = _default;
});