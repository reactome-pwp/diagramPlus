import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Diagram} from "../model/diagram-resource.model";
import {map, Observable, tap} from "rxjs";
import {v4 as uuid} from "uuid";

@Injectable({
    providedIn: 'root'
})
export class DiagramService {

    public elements: any = {};

    constructor(private http: HttpClient) {
    }

    nodeTypeMap = new Map<string, string>([
            ['Protein', 'macromolecule'],
            ['EntitySet', 'complex'],
            ['Complex', 'complex'],
            ['Compartment', 'compartment'],
            ['Entity', 'complex'],
            ['ProteinDrug', 'complex'],
            ['Chemical', 'complex'],
            ['ComplexDrug', 'complex'],
            ['ProteinDrug', 'complex'],
            ['ProcessNode', 'complex'],
            ['EntitySetAndEntitySetLink', 'stimulation'],
            ['EncapsulatedNode', 'complex'] //todo: schema class name is pathway


        ]
    )

    reactionTypeMap = new Map<string, string>([
            ['BOX', 'process'],
            ['CIRCLE', 'association'],
            ['DOUBLE_CIRCLE', 'dissociation'],
        ]
    )

    edgeTypeMap = new Map<string, string>([
            ['INPUT', 'consumption'],
            ['OUTPUT', 'production'],
            ['ACTIVATOR', 'stimulation'],
            ['CATALYST','catalysis'],
        ]
    )

    public getDiagramJSON(dbId: number): Observable<any> {
        return this.http.get<Diagram>('assets/R-HSA-' + dbId + '.json').pipe(
            tap((data) => console.log(data)),
            map((data) => {
                //compartments map  compartment id as key, a list of nodes as value
                const compartments: { [key: number]: number[] } = {};
                data.compartments.map(compartment => {
                    compartment.componentIds.forEach((id) => {
                        compartments[compartment.id] = compartment.componentIds
                    })
                    return compartments
                })

                //compartment nodes
                const compartmentNodes = data?.compartments.map(item => ({
                    data: {
                        id: item.id,
                        parent: Object.entries(compartments).find(([key, value]) => value.includes(item.id))?.[0],
                        label: item.displayName,
                        width: item.prop.width,
                        height: item.prop.height,
                        class: this.nodeTypeMap.get(item.renderableClass) || item.renderableClass.toLowerCase(),
                        clonemarker: false,
                        stateVariables: [],
                        unitsOfInformation: []
                    },
                    position: item.position,

                }));

                //reaction nodes
                const reactionNodes = data?.edges.map(item => ({
                    data: {
                        id: item.id,
                        // label: item.displayName,
                        class: this.reactionTypeMap.get(item.reactionShape.type) || item.reactionShape.type.toLowerCase(),
                        inputs: item.inputs,
                        output: item.outputs,
                        clonemarker: false,
                        stateVariables: [],
                        renderableClass: item.renderableClass,
                        unitsOfInformation: []
                    },
                  position: item.reactionShape.centre,
                  //disable interaction
                  //grabbable: false
                }));


                //entity nodes
                const entityNodes = data?.nodes.map(item => ({
                        data: {
                            id: item.id,
                            parent: Object.entries(compartments).find(([key, value]) => value.includes(item.id))?.[0],
                            label: item.displayName,
                            height: item.prop.height,
                            width: item.prop.width,
                            class: this.nodeTypeMap.get(item.renderableClass) || item.renderableClass.toLowerCase(),
                            clonemarker: false,
                            stateVariables: [],
                            unitsOfInformation: [],
                        },
                         position: {x: item.position.x + 0.5 * (item.prop.width), y: item.position.y + 0.5 * (item.prop.height)}
                       // position: item.position,
                       // grabbable: false
                    }
                ));

                //iterate nodes connectors to get all edges information based on the connector type.
                const edges = data.nodes.flatMap(node => {
                    const  inputs: any[]= [];
                    const  outputs :any[] = [];
                    node.connectors.forEach(connector => {
                        if (connector.type !== 'OUTPUT') {
                            inputs.push({
                                data: {
                                    id: uuid(),
                                    source: node.id,
                                    target: connector.edgeId,
                                    class: this.edgeTypeMap.get(connector.type),
                                    type: 'input',
                                    cardinality: connector.stoichiometry,
                                    portSource: node.id,
                                    portTarget: connector.edgeId,
                                }
                            });
                        }
                        if (connector.type === 'OUTPUT') {
                            outputs.push({
                                data: {
                                    id: uuid(),
                                    source: connector.edgeId,
                                    target: node.id,
                                    class: this.edgeTypeMap.get(connector.type),
                                    type: 'output',
                                    portSource: connector.edgeId,
                                    portTarget: node.id,
                                }
                            });
                        }
                    });

                    return [...inputs, ...outputs]
                });


                const linkEdges = data.links?.map(link => ({
                            data: {
                                id: link.id,
                                source: link.inputs[0].id,
                                target: link.outputs[0].id,
                                class: link.renderableClass, // EntitySetAndEntitySetLink, this should be dotted line
                                portSource: link.inputs[0].id,
                                portTarget: link.outputs[0].id
                            }
                        }
                    )
                )

                return this.elements = {
                    nodes: [...reactionNodes, ...entityNodes, ...compartmentNodes],
                    edges: [...edges ,...linkEdges]
                };
            }))
    }
}
