export class WebWorker {
  #worker;
  #messageId = 1;
  #messages = new Map();

  #MESSAGE_TYPE;

  #RESULT_ERROR = 0;
  #RESULT_SUCCESS = 1;

  constructor(worker) {
    this.#worker = worker;
    this.#worker.onmessage = this.#onMessage.bind(this);

    this.#MESSAGE_TYPE = {
      RESULT: this.#onResult.bind(this),
      CALLBACK: this.#onCallback.bind(this),
    };
  }

  postMessage(data = null, callback = null, transferable = []) {
    return new Promise((res, rej) => {
      const messageId = this.#messageId++;
      this.#messages.set(messageId, [res, rej, callback]);
      this.#worker.postMessage([messageId, data], transferable);
    });
  }

  #onMessage(event) {
    if (!Array.isArray(event.data)) {
      return;
    }

    const [type, ...args] = event.data;

    this.#MESSAGE_TYPE[type]?.(...args);
  }

  #onResult(messageId, success, payload) {
    const [res, rej] = this.#messages.get(messageId);
    this.#messages.delete(messageId);

    return success === this.#RESULT_SUCCESS ? res(payload) : rej(payload);
  }

  #onCallback(messageId, data) {
    const [, , callback] = this.#messages.get(messageId);
    callback?.(data);
  }

  terminate() {
    this.#worker.terminate();
  }
}
