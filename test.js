console.log(1) // synchronous

setTimeout(() => {
  console.log(2) // timer
}, 0)

process.nextTick(() => {
  console.log(3) // nextTick
})

Promise.resolve()
  .then(() => {
    console.log(4) // microtask - promise
  })
  .then(() => {
    console.log(5) // another microtask within the same promise
  })

setImmediate(() => {
  console.log(6) // immediate
})

console.log(7) // synchronous

// 1, 7, 3, 4, 5, 2, 6
