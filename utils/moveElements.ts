export function moveElement<T>(arr: T[], move: { from: number; to: number }): T[] {
  const { from, to } = move;

  if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) {
    return arr;
  }

  const newArray = [...arr];

  const [movedElement] = newArray.splice(from, 1);

  newArray.splice(to, 0, movedElement);

  return newArray;
}
