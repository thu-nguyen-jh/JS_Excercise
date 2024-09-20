// Ex 2: Given an array of integers, find integers with the most repetitions. If multiple numbers have the same maximum number of repetition, export all of them.
// Maximum 3 rounds, not nested.

const array = [1, 2, 3, 4, 5, 0, 2, 3, 3, 4,4, 2];

function findMostRepeatedIntegers(array) {
  const dict = {};
  array.forEach((item) => {
    if (dict[item]) {
      dict[item] += 1
    }
    else {
      dict[item] = 1
    }
  })
  const maxVal = Math.max(...Object.values(dict))
  
  const keys = Object.keys(dict).filter((key) => dict[key] === maxVal)  
  return keys.map(Number)
}

console.log(findMostRepeatedIntegers(array))