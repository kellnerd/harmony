export default class AccessibilityData {
    constructor(data) {
        if ('accessibilityIdentifier' in data) {
            this.accessibility_identifier = data.accessibilityIdentifier;
        }
        if ('identifier' in data) {
            this.identifier = {
                accessibility_id_type: data.identifier.accessibilityIdType
            };
        }
        if ('label' in data) {
            this.label = data.label;
        }
    }
}
//# sourceMappingURL=AccessibilityData.js.map