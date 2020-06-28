export const getRange = length => [...Array(length).keys()]; //getRange(2)=>[0,1]
//const argsToArr = (...args) => args
//==> argsToArr(1,2,3,4) ==> [1,2,3,4]
export const getRandomFrom = (...args) => args[Math.floor(Math.random() * args.length)];
//[[1,4],[1,1],[8]] ==> [1,4,1,1,8]
// export const flatten = arrays => arrays.reduce((acc, row) => [...acc, ...row], [])
export const flatten = arrays => arrays.flat();

//when assigned a variable to this function, the listener is added:
	//const removeListener = registerListener ==> this adds it
	//removeListener ==> this removes it again
export const registerListener = (eventName, handler) => {
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
}

export const toDegrees = radians => (radians * 180) / Math.PI;
export const toRadians = degrees => (degrees * Math.PI) / 180;

export const withoutElement = (array, element) => array.filter(e => e !== element); //removes element
export const updateElement = (array, oldElement, newElement) => array.map(e => e===oldElement ? newElement : e); //replaces oldElement with newElement
