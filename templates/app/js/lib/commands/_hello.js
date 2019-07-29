const hello = (ctx) => {
  ctx.createFile({
    at: 'hello.txt',
    content: 'Hello, World!\n'
  });
};

module.exports = hello;
