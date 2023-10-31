import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {diagramJSON} from "../model/diagram-json.model";
import {map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DiagramService {

  private elements: any = {};

  constructor(private http: HttpClient) {

  }

  public getDiagramJSON(dbId: number): Observable<any> {
    return this.http.get<diagramJSON>('assets/R-HSA-' + dbId + '.json').pipe(
      tap((data) => console.log(data)),
      map((data) => {

        //compartments map
        const compartments: { [key: number]: number[] } = {};
        data.compartments.map(compartment => {
              compartment.componentIds.forEach((id) => {
                  compartments[compartment.id] = compartment.componentIds
              })
              return compartments
          })


        const reactionNodes = data?.edges.map(item => ({
          data: {
            id: item.id,
            label: item.displayName,
              class: "association", // not correct here, it should be reaction
              clonemarker: false,
              stateVariables: [],
              unitsOfInformation: [],
          },
          position: item.position
        }));

        const entityNodes = data?.nodes.map(item => ({
          data: {
             id: item.id,
             parent: item.id,
             label: item.displayName,
             height: item.prop.height,
             width: item.prop.width,
             class: item.renderableClass == "EntitySet" || "Protein" ? "complex" : item.renderableClass,
             clonemarker: false,
             stateVariables: [],
             unitsOfInformation: [],
             },
         position: {x: item.position.x + 0.5*(item.prop.width), y: item.position.y +0.5*(item.prop.height)}
              //  position:item.position
          }
        ));

        const nodeInputEdges = data?.edges?.flatMap(edge =>
          edge.inputs.map(input => ({
            data: {
              source: input.id.toString(),
              target: edge.id.toString(),
                class: "production",
                cardinality: 0,
                portSource: input.id.toString(),
                portTarget: edge.id.toString(),
            }
          }))
        ) || [];


        console.log(Object.entries(compartments).find(([key, value]) => value.includes(8))?.[0])

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

        const nodeOutputEdges = data?.edges?.flatMap(edge =>
          edge.outputs.map(output => ({
            data: {
              source: edge.id.toString(),
              target: output.id.toString()
            }
          }))
        ) || [];

        this.elements = {
          nodes: [...reactionNodes, ...entityNodes],
          edges: [...nodeInputEdges, ...nodeOutputEdges]
        };
        console.log(this.elements);
        return this.elements;

      }))
  }
}
