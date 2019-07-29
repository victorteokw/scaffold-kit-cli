import { Executable } from "scaffold-kit";

const hello: Executable = (ctx) => {
  ctx.createFile({
    at: 'hello.txt',
    content: 'Hello, World!\n'
  });
};

export default hello;
