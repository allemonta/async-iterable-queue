# Dynamic Async Iterable

A simple asynchronous queue with an async iterator interface, supporting dynamic enqueueing.

## Features

* Async iterable interface (`for await...of`)
* Enqueue items dynamically
* Suitable for producer-consumer scenarios
* Written in TypeScript, with type declarations
* Lightweight and zero dependencies

## TL;DR

Install:

```bash
npm install dynamic-async-iterable
```

Use:

```ts
import DynamicAsyncIterable from "dynamic-async-iterable"

const iterable = new DynamicAsyncIterable<string>()
iterable.enqueue("hello")
iterable.enqueue("world")

for await (const item of iterable) {
  console.log(item)
}
```

## Installation

Install via npm:

```bash
npm install dynamic-async-iterable
```

or yarn:

```bash
yarn add dynamic-async-iterable
```

## Usage

Create an instance of `DynamicAsyncIterable`:

```ts
import DynamicAsyncIterable from "dynamic-async-iterable"

const iterable = new DynamicAsyncIterable<string>()
```

### Produce

Produce items asynchronously by calling the `enqueue` method:

```ts
iterable.enqueue("hello")
iterable.enqueue("world")
```

### Consume

Consume items with the async iterator interface, using `for await...of`:

```ts
for await (const item of iterable) {
  console.log(item)
}
```

## Example

### setTimeout producer

```ts
import DynamicAsyncIterable from "dynamic-async-iterable"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const produce = async (iterable: DynamicAsyncIterable<string>) => {
  await sleep(1000)
  iterable.enqueue("hello")
  await sleep(1000)
  iterable.enqueue("world")

  // Send the end signal
  iterable.end()
}

const iterable = new DynamicAsyncIterable<string>()

// Produce items asynchronously
void produce(iterable)

// Consume items
for await (const item of iterable) {
  console.log(item)
}

// Output:
// hello
// world
```

### EventEmitter producer

```ts
import DynamicAsyncIterable from "dynamic-async-iterable"
import EventEmitter from "node:events"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const produce = async (emitter: EventEmitter) => {
  await sleep(1000)
  emitter.emit("data", "hello")
  await sleep(1000)
  emitter.emit("data", "world")

  emitter.emit("end")
}

const iterable = new DynamicAsyncIterable<string>()
const emitter = new EventEmitter()

emitter.on("data", (data: string) => iterable.enqueue(data))
emitter.on("end", () => iterable.end())

// Produce items asynchronously
void produce(emitter)

for await (const item of iterable) {
  console.log(item)
}
```

## Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/allemonta/dynamic-async-iterable.git
cd dynamic-async-iterable
npm install
```

### Build

```bash
npm run build
```

### Run tests

Using Node.js built-in test runner and tsx for TypeScript support:

```bash
npm test
```
