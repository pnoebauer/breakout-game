import Vector from './vector';
import { flatten, getRandomFrom, withoutElement, updateElement } from '../utils';

// const PADDLE_AREA = 1 / 3;
const BLOCK_WIDTH = 1;
const BLOCK_HEIGHT = 1 / 3;
const PADDLE_HEIGHT = BLOCK_HEIGHT;
const BALL_RADIUS = 1 / 5;

const LEFT = new Vector(-1,0);
const RIGHT = new Vector(1,0);
const UP = new Vector(0,-1);
const DOWN = new Vector(0, 1);

const LEFT_UP = LEFT.add(UP).normalize();
const RIGHT_UP = RIGHT.add(UP).normalize();

const DISTANCE_IN_MS = 0.005; //distance ball and paddle go in one millisecond with speed equal to one

export const MOVEMENT = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};

//after hitting an object ball will be randomly distored
const getDistortedDirection = (vector, distortionLevel = 0.3) => {
  const getComponent = () => Math.random() * distortionLevel - distortionLevel / 2;
  const distortion = new Vector(getComponent(), getComponent());
  return vector.add(distortion).normalize();
}

//check if paddle was moved left or right
const getNewPaddle = (paddle, size, distance, movement) => {
  if (!movement) return paddle; 
  //replace 'LEFT'/'RIGHT' with the vector ((-1,0)/(1/0))
  const direction = movement === MOVEMENT.LEFT ? LEFT : RIGHT;

  const { x } = paddle.position.add(direction.scaleBy(distance));
  //no changes possible except x direction
  const withNewX = x => ({
    ...paddle,
    position: new Vector(x, paddle.position.y)
  });

  //paddle reaches left border of the game field
  if (x < 0) {
    return withNewX(0);
  }
  //paddle reaches right border of the game field
  if (x + paddle.width > size.width) {
    return withNewX(size.width - paddle.width);
  }

  return withNewX(x);
}

//check if the ball is inside any boundaries
const isInBoundaries = (oneSide, otherSide, oneBoundary, otherBoundary) => (
  (oneSide >= oneBoundary && oneSide <= otherBoundary) ||
  (otherSide >= oneBoundary && otherSide <= otherBoundary)
)

//adjust ball direction after hitting object in case reflection angle is too low
const getAdjustedVector = (normal, vector, minAngle = 15) => {
  const angle = normal.angleBetween(vector);
  const maxAngle = 90 - minAngle;
  if (angle < 0) {
    if (angle > -minAngle) {
      return normal.rotate(-minAngle);
    }
    if (angle < -maxAngle) {
      return normal.rotate(-maxAngle);
    }
  } else {
    if (angle < minAngle) {
      return normal.rotate(minAngle);
    }
    if (angle > maxAngle) {
      return normal.rotate(maxAngle);
    }
  }
  return vector;
}

export const getNewGameState = (state, movement, timespan) => {
  const { size, speed, lives } = state;
  const distance = timespan * DISTANCE_IN_MS * speed;
  const paddle = getNewPaddle(state.paddle, size, distance, movement);

  const { radius } = state.ball;
  const oldDirection = state.ball.direction;
  const newBallCenter = state.ball.center.add(oldDirection.scaleBy(distance));
  const ballBottom = newBallCenter.y + radius;
  
  if (ballBottom > size.height) {
    return {
      ...state,
      ...getInitialPaddleAndBall(size.width, size.height, paddle.width),
      lives: lives - 1
    };
  }
  
  const withNewBallProps = props => ({
    ...state,
    paddle,
    ball: {
      ...state.ball,
      ...props
    }
  })

  const withNewBallDirection = normal => {
    const distorted = getDistortedDirection(oldDirection.reflect(normal));
    const direction = getAdjustedVector(normal, distorted);
    return withNewBallProps({ direction })
  }

  const ballLeft = newBallCenter.x - radius;
  const ballRight = newBallCenter.x + radius;
  const ballTop = newBallCenter.y - radius;
  const paddleLeft = paddle.position.x;
  const paddleRight = paddleLeft+ paddle.width;
  const paddleTop = paddle.position.y;

  const ballGoingDown = Math.abs(UP.angleBetween(oldDirection)) > 90;
  const hitPaddle = ballGoingDown && ballBottom >= paddleTop && ballRight >= paddleLeft && ballLeft <= paddleRight;
  if (hitPaddle) return withNewBallDirection(UP);
  if (ballTop <= 0) return withNewBallDirection(DOWN); //hit the top
  if (ballLeft <= 0) return withNewBallDirection(RIGHT);  //hit the left
  if (ballRight >= size.width) return withNewBallDirection(LEFT); //hit the right

  const block = state.blocks.find(({ position, width, height }) => (
    isInBoundaries(ballTop, ballBottom, position.y, position.y + height) &&
    isInBoundaries(ballLeft, ballRight, position.x, position.x + width) 
  ))

  if (block) {
    const density = block.density - 1;
    const newBlock = { ...block, density };
    //if the density is below zero remove it, otherwise update it with a density reduced by 1
    const blocks = density < 0 ? withoutElement(state.blocks, block) : updateElement(state.blocks, block, newBlock);
    
    const getNewBallNormal = () => {
      const blockTop = block.position.y;
      const blockBottom = blockTop + block.height;
      const blockLeft = block.position.x;
      if (ballTop > (blockTop - radius) && ballBottom < (blockBottom + radius)) {
        if (ballLeft < blockLeft) return LEFT;
        if (ballRight > blockLeft + block.width) return RIGHT;
      }
      if (ballTop > blockTop) return DOWN;
      if (ballTop <= blockTop) return UP;
    }
    return {
      ...withNewBallDirection(getNewBallNormal()),
      blocks
    }
  }

  return withNewBallProps({ center: newBallCenter })
}

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
		direction: getRandomFrom(LEFT_UP, RIGHT_UP) //randomly go left/right
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
    rowArr.map((density, columnNumber) => ({
          density,
          position: new Vector(columnNumber*BLOCK_WIDTH, blocksStart + (rowNumber * BLOCK_HEIGHT)),
          width: BLOCK_WIDTH,
          height: BLOCK_HEIGHT
        })
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