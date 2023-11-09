import {Component, OnInit} from '@angular/core';
import {DiagramService} from "../services/diagram.service";
import {DiagramJSON} from "../model/diagram-resource.model";
import * as cytoscape from "cytoscape";
import {NodeSingular} from "cytoscape";
import * as sbgnStylesheet from "cytoscape-sbgn-stylesheet";


@Component({
    selector: 'app-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {

    cy: any
    nodes: any;
    edges: any;
    elements: any;

    constructor(private diagramService: DiagramService) {
    }

    public getStyle: cytoscape.Stylesheet[] = [
        {
            selector: 'node',
            style: {
                'shape': 'rectangle',
                'content': 'data(label)',
                'width': 'data(width)',
                'height': 'data(height)',
                'border-width': 0,
                'text-halign': 'center',
                'text-valign': 'center',
                'text-wrap': 'wrap',
                'text-max-width': 'data(width)',
                'font-size': '12px'

            }
        },
        {
            selector: ':parent',
            style: {
                'text-valign': 'top',
                'text-halign': 'center',
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#989b92',
                'target-arrow-color': '#989b92',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier'
            }
        },
    ];


    ngOnInit() {
        this.getData(9752946);
    }

    getData(dbId: number): DiagramJSON | any {
        this.diagramService.getDiagramJSON(dbId).subscribe(data => {

                console.log("****cytoscapte data****");
                console.log(data);

                this.cy = cytoscape({
                    container: document.getElementById('cy'),
                    boxSelectionEnabled: false,
                    elements: data,
                    style: sbgnStylesheet(cytoscape),
                    layout: {
                        name: 'preset',
                    },
                });


                // Define a CSS class for entity nodes, may not be necessary
                this.cy.style().selector('.entity-node').style({
                    'width': 'data(width)',
                    'height': 'data(height)',
                    'border-width': 1,
                    'text-halign': 'center',
                    'text-valign': 'center',
                    'text-wrap': 'wrap',
                    'text-max-width': 'data(width)',
                    'font-size': '14px'
                })

                this.cy.nodes(`[class != "compartment"]`).addClass('entity-node')


                let node: NodeSingular | null = null;

                const handleNodeClick = (event: cytoscape.EventObject) => {
                    const clickedNode = event.target;
                    if (clickedNode.data('class') === 'association') { // it should be reaction
                        this.addHighlight(this.cy, clickedNode, true);

                        if (node !== null && node !== clickedNode) {
                            this.addHighlight(this.cy, node, false);
                        }
                        node = clickedNode;
                    }
                }

                const handleOutsideClick = (event: cytoscape.EventObject) => {
                    const clicked = event.target;
                    if (node !== null && clicked !== node) {
                        this.addHighlight(this.cy, node, false);
                        node = null;
                    }
                }

                const handleEdgeClick = (event: cytoscape.EventObject) => {
                    const clickedEdge = event.target;
                    const targetNodeId = clickedEdge.data('type') === 'input' ? clickedEdge.target().id() :clickedEdge.source().id();
                    const targetNode = this.cy.nodes(`[id="${targetNodeId}"]`)

                    if (targetNode.data('class') === 'association') {
                        this.addHighlight(this.cy, targetNode, true)
                        node = targetNode
                    }
                }

                this.cy.on('click', 'node', handleNodeClick);
                this.cy.on('click', handleOutsideClick);
                this.cy.on('click', 'edge', handleEdgeClick)

            }
        )
    }

    addHighlight(cy: any, element: any, addClass: boolean) {
        const style = {
            'border-width': '2px',
            'border-color': 'black',
            'background-color': 'blue',
            'line-color': 'blue'
        };

        cy.style().selector('.highlighted').style(style);

        if (addClass) {
            element.addClass('highlighted');
            element.connectedEdges().addClass('highlighted');
        } else {
            element.removeClass('highlighted');
            element.connectedEdges().removeClass('highlighted');
        }
    }

}
