export default class DynamicAsyncIterable<
    ITEM = unknown
> {
    private done: boolean = false
    private queue: ITEM[] = []
    private waitPromise: ((value?: unknown) => void) | undefined = undefined

    private waitData() {
        return new Promise((resolve) => this.waitPromise = resolve)
    }

    enqueue(value: ITEM) {
        if (this.done) {
            throw new Error("Cannot enqueue data after end() has been called")
        }

        this.queue.push(value)
        this.waitPromise?.()
        this.waitPromise = undefined
    }

    end() {
        this.done = true
        this.waitPromise?.()
        this.waitPromise = undefined
    }

    async *[Symbol.asyncIterator]() {
        while (true) {
            const value = this.queue.shift()
            if (value) {
                yield value
            } else {
                if (this.done) {
                    /*
                        No more chunks will be added, because:
                        - end() has been called
                        - the queue is empty
                    */
                    return
                }

                // No more chunks in the queue, wait for a new chunk
                await this.waitData()
            }
        }
    }
}
