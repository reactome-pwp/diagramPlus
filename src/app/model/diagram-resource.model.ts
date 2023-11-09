export interface DiagramJSON {

    displayName: string;
    edges: Edges[];
    nodes: Nodes[];
    compartments: Compartments[];
    links: Links[];

}

interface Activator {
    id: number;
    points: Position;
}

// reactions
export interface Edges {
    id: number
    displayName: string;
    inputs: Input[];
    outputs: Output[];
    position: Position;
    renderableClass: string;
    activators: Activator[];

}

export interface Input {
    id: number,
    points: Position[],
    stoichiometry: number
}

export interface Output {
    id: number
}

export interface Position {
    x: number;
    y: number;
}

export interface Prop {
    x: number;
    y: number;
    width: number;
    height: number;
}

// entities
export interface Nodes {

    id: number;
    displayName: string;
    renderableClass: string;
    position: Position;
    prop: Prop
}

export interface Compartments {
    id: number;
    componentIds: number[];
    displayName: string;
    position: Position;
    prop: Prop,
    renderableClass: string;

}

export interface Links{
    inputs: Input[];
    outputs: Output[];
}
