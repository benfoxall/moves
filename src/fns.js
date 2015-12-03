let distance = _ => Math.sqrt(_
    .map(x => x * x)
    .reduce((a, b) => a + b, 0)
   )
