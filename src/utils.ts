export const printMsg = (msg:string): void => {
  console.log({msg});
}

export const getUrl = (...arg: string[]) => arg.join('/');