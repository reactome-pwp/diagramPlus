import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DiagramJSON} from "../model/diagram-resource.model";
import {map, Observable, tap} from "rxjs";
import {v4 as uuid} from "uuid";

@Injectable({
    providedIn: 'root'
})
export class DiagramService {

    public elements: any = {};

    constructor(private http: HttpClient) {
    }

    public getDiagramJSON(dbId: number): Observable<any> {
        return this.http.get<DiagramJSON>('assets/R-HSA-' + dbId + '.json').pipe(
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
                        class: item.renderableClass.toLowerCase(),
                        clonemarker: false,
                        stateVariables: [],
                        unitsOfInformation: []
                    },
                    position: item.position
                }));

                //reaction nodes
                const reactionNodes = data?.edges.map(item => ({
                    data: {
                        id: item.id,
                        // label: item.displayName,
                        class: "association", // not correct here, it should be reaction
                        inputs: item.inputs,
                        output: item.outputs,
                        clonemarker: false,
                        stateVariables: [],
                        unitsOfInformation: []
                    },
                    position: item.position,
                }));

                const typeMap = new Map<string, string>([
                        ['Protein', 'macromolecule'],
                        ['EntitySet', 'complex'],
                        ['Complex', 'complex'],
                        ['Entity', 'complex'],
                        ['Proteindrug', 'complex'],
                        ['Chemical', 'complex'],
                        ['Complexdrug', 'complex'],
                        ['Proteindrug', 'complex']

                    ]
                )

                //entity nodes
                const entityNodes = data?.nodes.map(item => ({
                        data: {
                            id: item.id,
                            parent: Object.entries(compartments).find(([key, value]) => value.includes(item.id))?.[0],
                            label: item.displayName,
                            height: item.prop.height,
                            width: item.prop.width,
                            class: typeMap.get(item.renderableClass) || item.renderableClass.toLowerCase(),
                            clonemarker: false,
                            stateVariables: [],
                            unitsOfInformation: []
                        },
                        // position: {x: item.position.x + 0.5 * (item.prop.width), y: item.position.y + 0.5 * (item.prop.height)}
                        position: item.position
                    }
                ));

                // input edges
                const nodeInputEdges = data?.edges?.flatMap(edge =>
                    edge.inputs.map(input => ({
                        data: {
                            id: uuid(),
                            source: input.id,
                            target: edge.id,
                            class: "consumption",
                            type: 'input',
                            cardinality: input.stoichiometry,
                            portSource: input.id,
                            portTarget: edge.id,
                        }
                    }))
                )


                // const nodeInputEdges = from(data.edges).pipe(
                //     mergeMap(edge => (
                //         from(edge.inputs).pipe(
                //             mergeMap((input) => {
                //                 const source = input.id.toString();
                //                 const target = edge.id.toString();
                //                 return [{ data: { source, target } }];
                //             })
                //         )
                //     ))
                // )

                //output edges
                const nodeOutputEdges = data?.edges?.flatMap(edge =>
                    edge.outputs.map(output => ({
                        data: {
                            source: edge.id,
                            target: output.id,
                            class: 'production',
                            type: 'output',
                            portSource: edge.id,
                            portTarget: output.id,
                        }
                    }))
                )

                const activatorInputEdges = data.edges?.flatMap(edge =>
                    edge.activators?.map(activator => ({
                        data: {
                            source: activator.id,
                            target: edge.id,
                            class: "stimulation",
                            type: "input",
                            cardinality: 0,
                            portSource: activator.id,
                            portTarget: edge.id
                        }
                    })) || []
                )

                return this.elements = {
                    nodes: [...reactionNodes, ...entityNodes, ...compartmentNodes],
                    edges: [...nodeInputEdges, ...nodeOutputEdges, ...activatorInputEdges]
                };
            }))
    }
}
