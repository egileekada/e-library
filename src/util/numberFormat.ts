import formatter from "format-number"


export const formatNumber = (number: any, prefix = "₦", symbol?: boolean) => {
  if(number === "***") {
    return (symbol ? prefix: "")+" ****"
  } else {
    return(
      formatter(symbol ? { prefix} : {})(number % 1 !== 0 ? number?.toFixed(2) : number)
    )
  }
}
  