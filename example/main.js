import { WebWorker } from "../web-worker.js";

const worker = new WebWorker(new Worker("worker.js"));

const test = await worker.postMessage({ method: "bigLoop" });
console.log(">>> bigLoop:", test);

const test2 = await worker.postMessage({ method: "add", args: [2, 5] });
console.log(">>> add:", test2);

const test3 = await worker.postMessage({ method: "add", args: [2, -5] }, (data) => {
  console.log(":::", data);
});
