
export interface diagramJSON {

  displayName: string;
  edges: Edges[];
  nodes: Nodes[];
  compartments: compartments[];

}

// reactions
export interface Edges {
  id:number
  displayName: string;
  inputs: input[];
  outputs: output[];
  position: position;
  renderableClass: string;

}

export interface input{
  id:number
}

export interface output{
  id:number
}

export interface position {
  x: number;
  y: number;
}
export interface prop {
  x: number;
  y: number;
  width: number;
  height: number;
}

// entities
export interface Nodes{

  id:number;
  displayName: string;
  renderableClass: string;
  position: position;
  prop: prop
}

export interface compartments {
  id:number;
  componentIds: number[];
  displayName: string;
}
