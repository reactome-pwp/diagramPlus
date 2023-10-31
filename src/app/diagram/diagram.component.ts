import {Component, OnInit} from '@angular/core';
import {DiagramService} from "../services/diagram.service";
import {diagramJSON} from "../model/diagram-json.model";
import * as cytoscape from "cytoscape";
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

  getData(dbId: number): diagramJSON | any {
    this.diagramService.getDiagramJSON(dbId).subscribe(nodes => {
        this.cy = cytoscape({
          container: document.getElementById('cy'),
          elements: nodes,
          style: sbgnStylesheet(cytoscape),
          layout: {
            name: 'preset',
          },

        });


      this.cy.style().selector('node').style({
        'width': 'data(width)',
        'height': 'data(height)',
        'border-width': 1,
        'text-halign': 'center',
        'text-valign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': 'data(width)',
        'font-size': '14px'
      }).update()
      }
    )
  }

}
