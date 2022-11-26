const FIREBASE_DOMAIN = 'https://react-http-4c0bb-default-rtdb.asia-southeast1.firebasedatabase.app';

export async function getAllItems() {
    const response = await fetch(`${FIREBASE_DOMAIN}/items.json`);
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch items.');
    }
  
    const transformedItems = [];
  
    for (const key in data) {
      const itemObj = {
        ...data[key],
        id: key
      };
      //console.log(itemObj);
      if(itemObj.id){//if not empty, push
        transformedItems.push(itemObj);
      }
    }
    //console.log(itemObj);
    return transformedItems;
  }

  export async function addItem(itemData) {
    const response = await fetch(`${FIREBASE_DOMAIN}/items.json`, {
      method: 'POST',
      body: JSON.stringify(itemData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not create item.');
    }
    //console.log(data);
    return data.name;
  }

  export async function updateItem(requestData) {

    const response = await fetch(`${FIREBASE_DOMAIN}/items/${requestData.id}.json`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not UPDATE ITEM.');
    }
  
    return { itemId: data.id };
  }

  export async function deleteItem(requestData) {

    const response = await fetch(`${FIREBASE_DOMAIN}/items/${requestData.id}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not DELETE ITEM.');
    }
  
    return { itemId: requestData.id };
  }

  export async function addSale(itemData) {
    const response = await fetch(`${FIREBASE_DOMAIN}/sales.json`, {
      method: 'POST',
      body: JSON.stringify(itemData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not create sale.');
    }
    //console.log(data);
    return data.name;
  }

  export async function getAllSales() {
    const response = await fetch(`${FIREBASE_DOMAIN}/sales.json`);
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch sales.');
    }
  
    const transformedItems = {sales:[],debt:[]};
    //add key from firebase to id property for each object
    for (const key in data) {
      const itemObj = {
        ...data[key],
        id: key
      };
      //console.log(itemObj);
      if(itemObj.id&&(itemObj.debt===false)){//if not empty and sale debt flag is false, push
        transformedItems.sales.push(itemObj);
      }
      else if(itemObj.id&&itemObj.debt){//if not empty and sale debt flag is true, push
        transformedItems.debt.push(itemObj);
      }
    }
    //console.log(itemObj);
    return transformedItems;
  }

  export async function deleteSales(requestData) {

    const response = await fetch(`${FIREBASE_DOMAIN}/sales/${requestData.id}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not DELETE ITEM.');
    }
  
    return { salesId: requestData.id };
  }

  export async function paidDebt(requestData) {

    const response = await fetch(`${FIREBASE_DOMAIN}/sales/${requestData.id}.json`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not UPDATE Sales.');
    }
  
    return { salesId: data.id };
  }