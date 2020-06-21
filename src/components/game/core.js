import Vector from './vector';
import { flatten, getRandomFrom } from '../../utils';

// const PADDLE_AREA = 1 / 3;
const BLOCK_WIDTH = 1;
const BLOCK_HEIGHT = 1 / 3;
const PADDLE_HEIGHT = BLOCK_HEIGHT;
const BALL_RADIUS = 1 / 5;

const LEFT = new Vector(-1,0);
const RIGHT = new Vector(1,0);
const UP = new Vector(0,-1);

const LEFT_UP = LEFT.add(UP).normalize();
const RIGHT_UP = RIGHT.add(UP).normalize();


export const getInitialPaddleAndBall = (width, height, paddleWidth) => {
	const paddleY = height - PADDLE_HEIGHT; //paddle/block are defined by their top-left corner
	const paddleX = (width-paddleWidth)/2;
  const paddle = {
		position: new Vector(paddleX, paddleY), //screen center
		height: PADDLE_HEIGHT,
		width: paddleWidth,
	}
	const ball = {
		center: new Vector(width/2, paddleY-BALL_RADIUS),
		radius: BALL_RADIUS,
		direction: getRandomFrom(LEFT_UP, RIGHT_UP); //randomly go left/right
	}

	return {
		paddle,
		ball
	}
}

export const getGameStateFromLevel = ({ lives, paddleWidth, speed, blocks }) => {
  //blocks consists of an array of arrays; the inner array has a length based on columns, the outer has lenght based on rows  
  //getBlocks(2,3) => [ArrayA(3), ArrayB(3)] ==> blocks[0] = ArrayA; 
  const width = blocks[0].length*BLOCK_WIDTH; //returns number of columns; blocks.length returns number of rows
  const height = width; //GAME field is a square, block width = 1

  const blocksStart = ((height - height * PADDLE_HEIGHT) - blocks.length * BLOCK_HEIGHT) / 2;

  const rowsOfBlocks = blocks.map((rowArr, rowNumber) =>
    rowArr.map((density, columnNumber) => {
      density,
      position: new Vector(columnNumber*BLOCK_WIDTH, blocksStart + (rowNumber * BLOCK_HEIGHT)),
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT
    }
  ));

  const size = {
    width,
    height
  };
  
  return {
    size,
    blocks: flatten(rowsOfBlocks),
    ...getInitialPaddleAndBall(width, height, paddleWidth),
    lives,
    speed
  }
}