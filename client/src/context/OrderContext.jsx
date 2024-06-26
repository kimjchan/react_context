import { createContext, useEffect, useMemo, useState } from "react";

export const OrderConext = createContext();

export function OrderConextProvide(props){

  const [orderCounts, setOrderCounts] = useState({
    products: new Map(),
    options: new Map(),
  })

  const [totals, setTotals] = useState({
    products: 0,
    options: 0,
    total: 0,
  });

  const pricePerItem = {
    products: 1000,
    options: 500,
  }

  const calculateSubtotal = (orderType, orderCounts) => {
    let optionCount = 0;
    for(const count of orderCounts[orderType].values()) {
      optionCount += count;
    }
    return optionCount * pricePerItem[orderType];
    
  }

  useEffect(()=>{
    const productsTotal = calculateSubtotal("products", orderCounts);
    const optionsTotal = calculateSubtotal("options", orderCounts);
    const total = productsTotal + optionsTotal;
    setTotals({
      products: productsTotal,
      options: optionsTotal,
      total: total,
    })
  },[orderCounts])

  const value = useMemo(()=>{
    function updateItemCount(itemName, newItemCount, orderType){
      const newOrderCounts = {...orderCounts}; //객체 복사
      const orderCountsMaps = orderCounts[orderType];
      orderCountsMaps.set(itemName, parseInt(newItemCount));
      setOrderCounts(newOrderCounts);
    }
    return [{...orderCounts, totals}, updateItemCount]
  },[orderCounts, totals])
  return <OrderConext.Provider value={value} {...props}/>;
}