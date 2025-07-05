import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Thumbnail from './misc/Thumbnail.js';
class ButtonView extends YTNode {
    constructor(data) {
        super();
        if ('secondaryIconImage' in data)
            this.secondary_icon_image = Thumbnail.fromResponse(data.secondaryIconImage);
        if ('iconName' in data)
            this.icon_name = data.iconName;
        if ('enableIconButton' in data)
            this.enable_icon_button = data.enableIconButton;
        if ('tooltip' in data)
            this.tooltip = data.tooltip;
        if ('iconImageFlipForRtl' in data)
            this.icon_image_flip_for_rtl = data.iconImageFlipForRtl;
        if ('buttonSize' in data)
            this.button_size = data.buttonSize;
        if ('iconPosition' in data)
            this.icon_position = data.iconPosition;
        if ('isFullWidth' in data)
            this.is_full_width = data.isFullWidth;
        if ('state' in data)
            this.state = data.state;
        if ('onDisabledTap' in data)
            this.on_disabled_tap = new NavigationEndpoint(data.onDisabledTap);
        if ('customBorderColor' in data)
            this.custom_border_color = data.customBorderColor;
        if ('onTap' in data)
            this.on_tap = new NavigationEndpoint(data.onTap);
        if ('style' in data)
            this.style = data.style;
        if ('iconImage' in data)
            this.icon_image = data.iconImage;
        if ('customDarkThemeBorderColor' in data)
            this.custom_dark_theme_border_color = data.customDarkThemeBorderColor;
        if ('title' in data)
            this.title = data.title;
        if ('targetId' in data)
            this.target_id = data.targetId;
        if ('enableFullWidthMargins' in data)
            this.enable_full_width_margins = data.enableFullWidthMargins;
        if ('customFontColor' in data)
            this.custom_font_color = data.customFontColor;
        if ('type' in data)
            this.button_type = data.type;
        if ('enabled' in data)
            this.enabled = data.enabled;
        if ('accessibilityId' in data)
            this.accessibility_id = data.accessibilityId;
        if ('customBackgroundColor' in data)
            this.custom_background_color = data.customBackgroundColor;
        if ('onLongPress' in data)
            this.on_long_press = new NavigationEndpoint(data.onLongPress);
        if ('titleFormatted' in data)
            this.title_formatted = data.titleFormatted;
        if ('onVisible' in data)
            this.on_visible = data.onVisible;
        if ('iconTrailing' in data)
            this.icon_trailing = data.iconTrailing;
        if ('accessibilityText' in data)
            this.accessibility_text = data.accessibilityText;
    }
}
ButtonView.type = 'ButtonView';
export default ButtonView;
//# sourceMappingURL=ButtonView.js.map