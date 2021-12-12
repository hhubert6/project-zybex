import { Vector } from '../vector';

export interface mapElementType {
  spritePos: number[];
  dimensions: number[];
}

export interface mapElement {
  type: string;
  pos: number[];
}

export interface mapElementTypes {
  [name: string]: mapElementType;
}

export interface map {
  width: number;
  types: mapElementTypes;
  elements: mapElement[];
}
