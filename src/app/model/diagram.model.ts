
//todo refactor below to remove duplicated properties
export interface Diagram {

  /**
   * Returns the name of the pathway represented with the diagram (process)
   */
  displayName: string;

  /**
   * The list of contained edges(reaction node)
   */
  edges: Edges[];

  /**
   * The list of contained nodes
   */
  nodes: Nodes[];

  /**
   * The list of contained compartments
   */
  compartments: Compartments[];

  /**
   * The list of contained links
   */
  links: Links[];

  shadows: Shadows[];

}

interface Activator {
  id: number;
  position: Position;
}


export interface ReactionShip {
  a: Position;
  b: Position;
  centre: Position;
  type: string;

}

// reactions
export interface Edges {
  id: number
  displayName: string;
  renderableClass: string;
  inputs: Input[];
  outputs: Output[];
  position: Position;
  activators: Activator[];
  reactionShape: ReactionShip;
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

interface Connectors {
  id: number;
  edgeId: number;
  type: string;
  stoichiometry: number
}

// entities
export interface Nodes {

  id: number;
  displayName: string;
  renderableClass: string;
  position: Position;
  prop: Prop,
  connectors: Connectors[]
}

export interface Compartments {
  id: number;
  displayName: string;
  renderableClass: string;
  position: Position;
  prop: Prop,
  componentIds: number[];
}

interface Shadows {
  id: number
  displayName: string;
  position: Position;
  renderableClass: string;
  schemaClass: string;
  prop: Prop,
}

export interface Links {
  id: number
  renderableClass: string;
  inputs: Input[];
  outputs: Output[];

}
