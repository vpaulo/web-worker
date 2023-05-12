export class WebWorker {
  #worker;
  #messages = new Map();

  constructor(worker) {
    this.#worker = worker;
    this.#worker.onmessage = this.#onMessage.bind(this);
  }

  /**
   * @param { method: string, args: [] } data
   */
  postMessage(data = null, callback = null, transferable = []) {
    return new Promise((res, rej) => {
      const messageId = crypto.randomUUID();
      this.#messages.set(messageId, [res, rej, callback]);
      this.#worker.postMessage([messageId, data], transferable);
    });
  }

  #onMessage(event) {
    const { messageId, result, error } = event.data;
    const [res, rej, callback] = this.#messages.get(messageId);
    this.#messages.delete(messageId);

    if (error) {
      rej(new Error(error));
    } else if (callback) {
      callback(result);
    } else {
      res(result);
    }
  }

  terminate() {
    this.#worker.terminate();
  }
}
