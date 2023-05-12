self.onmessage = (event) => {
  const [messageId, { method, args = [] }] = event.data;
  console.log(">> Worker: ", messageId, method, args);

  if (typeof self[method] === "function") {
    self[method](...args)
      .then((result) => {
        self.postMessage({ messageId, result });
      })
      .catch((error) => {
        self.postMessage({ messageId, error });
      });
  } else {
    self.postMessage({ messageId, error: "Method not found" });
  }
};

async function bigLoop() {
  let sum = 0;
  for (let i = 0; i < 100; i++) {
    sum += i;
  }
  return sum;
}

async function add(a, b) {
  return a + b;
}
