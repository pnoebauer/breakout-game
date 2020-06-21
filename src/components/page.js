import React, { useRef, useEffect, useState } from 'react';

import Scene from './scene';
import { registerListener } from '../utils';

export default () => {
	const sceneContainer = useRef();
  	const [size, setSize] = useState();

  	useEffect(() => {
	    const onResize = () => {
	    //Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
	      const { width, height } = sceneContainer.current.getBoundingClientRect();
	      setSize({ width, height });
	      console.log('resized');
	    }

	    const unregisterResizeListener = registerListener('resize', onResize);
		console.log('registered listener');

	    onResize();

	    console.log('unregister listener');
	    return unregisterResizeListener;
  	}, [])

	return (
		<div className='page'>
			<div className='scene-container' ref={sceneContainer}>
        			{	size && 
        				<Scene width={size.width} height={size.height} 
        				/> /*only calls Scene if size is true*/}
      		</div>
		</div>
		)
}