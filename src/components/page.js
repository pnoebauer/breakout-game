import React, { useRef, useEffect, useState } from 'react';

import Scene from './scene';
import { registerListener } from '../utils';

export default () => {
	const sceneContainer = useRef();
	// const sceneContainerA = useRef();
  	const [size, setSize] = useState();

  	useEffect(() => {
  		//set size states
	    const onResize = () => {
	    //Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
	    //box-sizing is used so padding and border is not included
	      const { width, height } = sceneContainer.current.getBoundingClientRect();
	      setSize({ width, height });
	      console.log('resized', width, height);
	      // console.log('page',sceneContainerA.current.getBoundingClientRect().width);
	    }
		
		onResize(); //call onResize after the initial render

		// adds the risize listener, which calls onResize() upon a resize event
		console.log('registered listener'); 
	    const unregisterResizeListener = registerListener('resize', onResize); //window.addEventListener(eventName, handler);

	    //clean up the listener when unmounting or before executing the effect again
	    console.log('unregister listener');
	    return unregisterResizeListener; //() => window.removeEventListener(eventName, handler): useEffect cleanup performed through a function
  	}, [])

	return (
		<div className='page'>
			<div className='scene-container' ref={sceneContainer}>
    			{	size && 
    				<Scene width={size.width} height={size.height} /> /*only calls Scene if size is true*/
    			}
      		</div>
		</div>
		)
}