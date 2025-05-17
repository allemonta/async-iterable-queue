import { deepEqual, throws } from "node:assert"
import { test } from 'node:test'
import EventEmitter from "node:events"

import DynamicAsyncIterable from "../src"

test("sync-data", async () => {
    const iterable = new DynamicAsyncIterable<number>()

    const dataIn = [1, 2, 3]

    for (const data of dataIn) {
        iterable.enqueue(data)
    }

    iterable.end()

    const dataOut: number[] = []
    for await (const value of iterable) {
        dataOut.push(value)
    }

    deepEqual(dataIn, dataOut)
})

test("set-interval-data", async () => {
    const iterable = new DynamicAsyncIterable<number>()

    const dataIn = [1, 2, 3]

    let idx = 0
    const timeoutId = setInterval(() => {
        const value = dataIn[idx++]

        if (value === undefined) {
            clearInterval(timeoutId)
            iterable.end()
            return
        }

        iterable.enqueue(value)
    }, 100)

    const dataOut: number[] = []
    for await (const value of iterable) {
        dataOut.push(value)
    }

    deepEqual(dataIn, dataOut)
})

test("event-emitter-data", async () => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    const produce = async (emitter: EventEmitter, data: number[]) => {
        for (const item of data) {
            await sleep(100)
            emitter.emit("data", item)
        }

        emitter.emit("end")
    }

    const dataIn = [1, 2, 3]

    const iterable = new DynamicAsyncIterable<number>()
    const emitter = new EventEmitter()

    emitter.on("data", (data) => iterable.enqueue(data))
    emitter.on("end", () => iterable.end())

    // Produce items asynchronously
    void produce(emitter, dataIn)

    const dataOut: number[] = []
    for await (const value of iterable) {
        dataOut.push(value)
    }

    deepEqual(dataIn, dataOut)
})

test("enqueue-after-end", async () => {
    const iterable = new DynamicAsyncIterable<number>()
    iterable.end()

    throws(() => iterable.enqueue(1))
})
