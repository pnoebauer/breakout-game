// import React from 'react';
import { getRange } from '../../utils';

export const BLOCK_MAX_DENSITY = 3

const getRandomBlock = () => Math.floor(Math.random() * BLOCK_MAX_DENSITY)
//ex: 2 rows, 3 columns filled with random numbers between 1 and 3
//      getBlocks(2,3) ==> [  [1,2,1],
//                          [2,3,1] ]
const getBlocks = (rows, columns) =>
  getRange(rows).map(() => 						//outer loop over rows
  	getRange(columns).map(getRandomBlock))		//inner loop over columns, assign row,col a random number

export const LEVELS = [
  {
    lives: 5,
    paddleWidth: 3.5,
    speed: 1,
    blocks: getBlocks(3, 6)
  },
  {
    lives: 4,
    paddleWidth: 3,
    speed: 1.4,
    blocks: getBlocks(4, 7)
  },
  {
    lives: 3,
    paddleWidth: 2.5,
    speed: 1.8,
    blocks: getBlocks(5, 8)
  },
  {
    lives: 3,
    paddleWidth: 2,
    speed: 2.2,
    blocks: getBlocks(6, 9)
  },
]