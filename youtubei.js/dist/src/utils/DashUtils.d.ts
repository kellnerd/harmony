declare global {
    namespace JSX {
        interface IntrinsicElements {
            [key: string]: DashProps;
        }
    }
}
export type DashChild = (DashNode | (DashNode | Promise<DashNode | DashNode[]>) | Promise<DashNode | DashNode[]>);
export interface DashProps {
    [key: string]: unknown;
    children?: DashChild[];
}
export interface DashNode {
    type: string;
    props: DashProps;
}
export declare function createElement(tagNameOrFunction: string | ((props: DashProps) => DashNode | Promise<DashNode>), props: {
    [key: string]: unknown;
} | null | undefined, ...children: DashChild[]): DashNode | Promise<DashNode>;
export declare function renderElementToString(element: DashNode | string): Promise<string>;
export declare function renderToString(root: DashNode | Promise<DashNode>): Promise<string>;
export declare function Fragment(props: DashProps): DashChild[] | undefined;
