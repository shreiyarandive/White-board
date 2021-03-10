import { rendererTypeName } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import Konva from 'konva';
import { Shape } from 'konva/types/Shape';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {

  shapes: any = [];
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  selectedButton: any = {
    'circle': false,
    'rectangle': false,
    'line': false,
    'undo': false,
    'erase': false,
    'clear': false
  }
  erase: boolean = false;

  constructor() { }

  ngOnInit(): void {
    //get the width and height of the window
    let width = window.innerWidth * 0.9;
    let height = window.innerHeight;

    //create a new Konva Stage in the container defined in html 
    this.stage = new Konva.Stage({
      container: 'container',
      width: width,
      height: height
    });

    // create a new Konva Stage and add it to the stage
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.addLineListeners();
  }

  // select the clicked button and change the color of the button to primary
  setSelection(shape: string) {
    this.selectedButton[shape] = true;
  }

  // add the Shape to the Konva Layer
  addShape(shape: string) {

    this.clearSelection();
    this.setSelection(shape);

    if (shape == 'circle') {
      this.addCircle();
    }
    else if (shape == 'rectangle') {
      this.addRectangle();
    }
    else if (shape == 'line') {
      this.addLine();
    }

  }

  // add a circle in the Konva
  addCircle() {
    const circle = new Konva.Circle({
      x: 100,
      y: 100,
      radius: 70,
      stroke: 'black',
      strokeWidth: 2,
      draggable: true
    })
    this.shapes.push(circle);
    this.layer.add(circle);
    this.stage.add(this.layer);
  }

  // add a rectangle to Kona Layer
  addRectangle() {
    const rectangle = new Konva.Rect({
      x: 20,
      y: 20,
      width: 100,
      height: 50,
      stroke: 'black',
      strokeWidth: 2,
      draggable: true
    });

    this.shapes.push(rectangle);
    this.layer.add(rectangle);
    this.stage.add(this.layer);
  }

  // add Line to the Konva Layer
  addLine() {
    this.selectedButton['line'] = true;

  }

  // the line creater
  addLineListeners() {

    const component = this;
    let lastLine: any;
    let isPaint: any;

    this.stage.on('mousedown touchstart', (e) => {
      if (!component.selectedButton['line'] && !component.erase) {
        return;
      }
      isPaint = true;
      let pos = component.stage.getPointerPosition();
      const mode = component.erase ? 'erase' : 'brush';
      lastLine = component.line(pos, mode);
      component.shapes.push(lastLine);
      component.layer.add(lastLine);
    });
    this.stage.on('mouseup touched', () => {
      isPaint = false;
    })
    this.stage.on('mousemove touchmove', () => {
      if (!isPaint) {
        return;
      }
      const position: any = component.stage.getPointerPosition();
      var newPoints = lastLine.points().concat([position.x, position.y]);
      lastLine.points(newPoints);
      component.layer.batchDraw();
    })
  }

  // creating the line object
  line(pos: any, mode: string = 'brush') {
    return new Konva.Line({
      stroke: 'red',
      strokeWidth: 5,
      globalCompositeOperation:
        mode == 'brush' ? 'source-over' : 'destination-out',
      points: [pos.x, pos.y],
      draggable: false
    })
  }

  // clears the selected button
  clearSelection() {
    Object.keys(this.selectedButton).forEach(key => {
      this.selectedButton[key] = false;
    });
  }

  // code for undo
  undo() {
    const removedShape = this.shapes.pop();
    console.log('removedShape', removedShape)
    if (removedShape) {
      removedShape.remove();
    }
    this.layer.draw();

  }

  // clears the complete board
  clearBoard() {
    location.reload();
  }
}
