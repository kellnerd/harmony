const XML_CHARACTER_MAP = {
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&apos;',
    '<': '&lt;',
    '>': '&gt;'
};
function escapeXMLString(str) {
    return str.replace(/([&"<>'])/g, (_, item) => {
        return XML_CHARACTER_MAP[item];
    });
}
function normalizeTag(tag) {
    return tag.charAt(0).toUpperCase() + tag.slice(1);
}
export function createElement(tagNameOrFunction, props, ...children) {
    const normalizedChildren = children.flat();
    if (typeof tagNameOrFunction === 'function') {
        return tagNameOrFunction({ ...props, children: normalizedChildren });
    }
    return {
        type: normalizeTag(tagNameOrFunction),
        props: {
            ...props,
            children: normalizedChildren
        }
    };
}
export async function renderElementToString(element) {
    if (typeof element === 'string')
        return escapeXMLString(element);
    let dom = `<${element.type}`;
    if (element.props) {
        for (const key of Object.keys(element.props)) {
            if (key !== 'children' && element.props[key] !== undefined) {
                dom += ` ${key}="${escapeXMLString(`${element.props[key]}`)}"`;
            }
        }
    }
    if (element.props.children) {
        const children = await Promise.all((await Promise.all(element.props.children.flat())).flat().filter((child) => !!child).map((child) => renderElementToString(child)));
        if (children.length > 0) {
            dom += `>${children.join('')}</${element.type}>`;
            return dom;
        }
    }
    return `${dom}/>`;
}
export async function renderToString(root) {
    const dom = await renderElementToString(await root);
    return `<?xml version="1.0" encoding="utf-8"?>${dom}`;
}
export function Fragment(props) {
    return props.children;
}
//# sourceMappingURL=DashUtils.js.map