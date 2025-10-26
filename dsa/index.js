// Given an array of integers, return the second largest unique number in the array.
// If it doesn’t exist, return -1.

// Example:

// Input: [3, 5, 2, 5, 6, 6, 1]
// Output: 5

// Input: [7, 7, 7]
// Output: -1

function secondLargestUnique(arr) {
  if (arr.length < 2) {
    console.log(-1);
    return;
  }
  const unique = [...new Set(arr)];

  if (unique.length < 2) {
    console.log(-1);
    return;
  }
  unique.sort((a, b) => b - a);
  console.log(unique[1]);
}
secondLargestUnique([3, 5, 2, 5, 6, 6, 1]);
secondLargestUnique([7, 7, 7]);