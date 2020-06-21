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
  window.addEventListener(eventName, handler)
  return () => window.removeEventListener(eventName, handler)
}