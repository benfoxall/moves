let distance = _ => Math.sqrt(_
    .map(x => x * x)
    .reduce((a, b) => a + b, 0)
   )

let colour = (i,a=1) =>
  `rgba(${Math.floor(i * 255)}, ${Math.floor((1-i) * 255)}, 0, ${a})`

let wrap = e => {
  return {
    alpha: Math.sin(Math.PI*(e.alpha/360)),
    beta:  Math.sin(Math.PI*(e.beta /360)),
    gamma: Math.sin(Math.PI*(e.gamma/180))
  }
}
