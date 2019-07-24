const hello = (ctx) => {
  ctx.createFile({
    at: 'hello.txt',
    content: 'Hello, World!'
  });
};

module.exports = hello;
