import { Maybe } from "seidr";

export function interpose<T>(a1: Array<T>, a2: Array<T>): Array<T> {
  const result: Array<T> = [];
  if (a1.length === 0) {
    return a2;
  }
  a1.forEach((el, i) => {
    result.push(el);
    Maybe.fromNullable(a2[i]).map(el2 => {
      if (i === a1.length - 1) {
        // if it's the end of a1, throw the rest of a2 in there
        result.push(...a2.slice(i));
        return;
      }
      result.push(el2);
    });
    
  });
  return result;
}

export function flatten<T>(arr: Array<Array<T>>): Array<T> {
  return arr.reduce((acc, cur) => [...acc, ...cur], []);
}

export function insertRandomly<T>(el: T, arr: Array<T>): Array<T> {
  const index = getRandomNumberBetween(0, arr.length - 1);
  const result = [...arr];
  result.splice(index, 0, el);
  return result;
}

export function getRandomNumberBetween(n1: number, n2: number): number {
  return Math.floor(Math.random() * n2) + n1;  // returns a random integer from n1 to n2;
}