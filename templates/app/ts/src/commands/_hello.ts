import { Executable } from "scaffold-kit";

const hello: Executable = (ctx, next) => {
  ctx.createFile({
    at: 'hello.txt',
    content: 'Hello, World!'
  });
};

export default hello;
