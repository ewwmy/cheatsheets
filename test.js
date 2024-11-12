const foo = 1

function a() {
  function b() {
    function c() {
      console.log(foo)
    }
    c()
  }
  b()
}

a() // 1
