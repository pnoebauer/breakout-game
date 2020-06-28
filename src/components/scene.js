import React, { useReducer } from 'react';

import { LEVELS } from '../game/levels';
import { getGameStateFromLevel } from '../game/core';

import Level from './level';
import Lives from './lives';
import Block from './block';
import Paddle from './paddle';
import Ball from './ball';

const getInitialLevel = () => {
  const inState = localStorage.getItem('level');
  return inState ? parseInt(inState, 10) : 0;
}

const getProjectors = (containerSize, gameSize) => {
  const widthRatio = containerSize.width / gameSize.width;
  const heightRatio = containerSize.height / gameSize.height;
  const unitOnScreen = Math.min(widthRatio, heightRatio);

  return {
    projectDistance: distance => distance * unitOnScreen,
    projectVector: vector => vector.scaleBy(unitOnScreen)
  };
}

const getInitialState = containerSize => {
  const level = getInitialLevel();
  const game = getGameStateFromLevel(LEVELS[level]);
  const { projectDistance, projectVector } = getProjectors(containerSize, game.size);
  return {
    level,
    game,
    containerSize,
    projectDistance,
    projectVector,
    time: Date.now(),
    stopTime: undefined,
    movement: undefined
  };
}

const reducer = state => state;

export default (containerSize) => {
  // console.log(containerSize); // returns object with size and width 
  // const [state, dispatch] = useReducer(reducer, initialArg, init); initialState set to init(initArg)
  const [state] = useReducer(reducer, containerSize, getInitialState);
  const {
    projectDistance,
    projectVector,
    level,
    game: {
      blocks,
      paddle,
      ball,
      size: {
        width,
        height
      },
      lives
    }
  } = state;

  const viewWidth = projectDistance(width);
  const viewHeight = projectDistance(height);
  const unit = projectDistance(ball.radius);
  return (
    <svg width={viewWidth} height={viewHeight} className='scene'>
      <Level unit={unit} level={level + 1} />
      <Lives unit={unit} lives={lives} containerWidth={viewWidth} />
      {blocks.map(({ density, position, width, height }) => (
        <Block
          density={density}
          width={projectDistance(width)}
          height={projectDistance(height)}
          {...projectVector(position)}
          key={`${position.x}-${position.y}`}
        />)
      )}
      <Paddle width={projectDistance(paddle.width)} height={projectDistance(paddle.height)} {...projectVector(paddle.position)} />
      <Ball {...projectVector(ball.center)} radius={unit} />
    </svg>
  )
}


// export default (containerSize) => {
//   console.log(`${containerSize.width} x ${containerSize.height}`)
//   return <svg/>
// }