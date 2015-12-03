let distance = _ => Math.sqrt(_
    .map(x => x * x)
    .reduce((a, b) => a + b, 0)
   )


let colour = i => `rgb(${Math.floor(i * 255)}, ${Math.floor((1-i) * 255)}, 0)`
