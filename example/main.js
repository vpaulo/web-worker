import { WebWorker } from "../web-worker.js";

const blobWorker = () => {
  const bigLoop = () => {
    let sum = 0;
    for (let i = 0; i < 100; i++) {
      sum += i;
    }
    return sum;
  };

  onmessage = (event) => {
    const [messageId, data] = event.data;
    console.log(messageId, data);
    if (data === "CALLBACK") {
      postMessage(["CALLBACK", messageId, "test 2"]);
    } else {
      postMessage(["RESULT", messageId, 1, bigLoop()]);
    }
  };
};

const url = URL.createObjectURL(
  new window.Blob(["(", blobWorker.toString(), ")()"], {
    type: "text/javascript",
  })
);

const worker = new WebWorker(new Worker(url));

const test = await worker.postMessage();
console.log(">>> :", test);

const test2 = await worker.postMessage("CALLBACK", (data) => {
  console.log(":::", data);
});
