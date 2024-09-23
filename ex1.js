// Ex 1: Given an array of integers, removing duplicate elements and creating an array whose elements are unique. 
//(Eg: [1,2,2,3,4,4,4,5,6] => [1,2,3,4,5,6]). Find 3-4 ways to solve this.


const a = [1,2,2,3,4,4,4,5,6,0,0]

function findUniqueArrayUsingForLoop(a) {
  const res = []
  for (let i = 0; i < a.length; i++) {
    const val = res.find((item)=> item === a[i])
    if(val === undefined) {
      res.push(a[i])
    }
  }  
  return res;
}

function findUniqueArrayUsingSet() {
  return [...new Set(a)]
}

function findUniqueArrayUsingObject(a) {
  const res = []
  const seen = {}
  for (let i = 0; i < a.length; i++) {
    if(!seen[a[i]]) {
      seen[a[i]] = true;
      res.push(a[i]) 
    }
  }
  return res
}
console.log("Find unique array using for loop: ", findUniqueArrayUsingForLoop(a))
console.log("Find unique array using set: ", findUniqueArrayUsingSet(a))
console.log("Find unique array using object: ", findUniqueArrayUsingObject(a))