const SARI_DOMAIN = 'http://192.168.100.4:8080';

//get all items for items table
export async function getAllItems() {
  
    const response = await fetch(`${SARI_DOMAIN}/items?page=1`);
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch items.');
    }
    //console.log(data);
    const transformedItems = [...data.items];
    //console.log(transformedItems);
    return {items:transformedItems,pageItems:data.pageItems,pages:data.pages,currentPage:data.currentPage};
  }
//add 1 item on items table
  export async function addItem(itemData,token) {
    const response = await fetch(`${SARI_DOMAIN}/items`, {
      method: 'POST',
      body: JSON.stringify(itemData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+token
      },
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not create item.');
    }
    //console.log(data);
    return data;
  }
//update 1 row for items table
  export async function updateItem(requestData,token) {

    const response = await fetch(`${SARI_DOMAIN}/items`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+token
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error.msg || 'Could not UPDATE ITEM.');
    }
  
    return data;
  }
//delete one item on items table
  export async function deleteItem(requestData,token) {

    const response = await fetch(`${SARI_DOMAIN}/items/`, {
      method: 'DELETE',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+token
      },
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not DELETE ITEM.');
    }
  
    return data;
  }
//add sale on sale table - this is called when you checkout the cart
  export async function addSale(itemData,token) {
    let response;
    if(token){
      response = await fetch(`${SARI_DOMAIN}/sales`, {
        method: 'POST',
        body: JSON.stringify(itemData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '+token
        },
      });
    }
    else{
      response = await fetch(`${SARI_DOMAIN}/sales/order`, {
        method: 'POST',
        body: JSON.stringify(itemData),
        headers: {
          'Content-Type': 'application/json'
        },
      });
    }
   
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not create sale.');
    }
    //console.log("saleID:" + data.id);
    return data;
  }


  export async function getAllSales(token) {
    const response = await fetch(`${SARI_DOMAIN}/sales`,{//token auth
      headers:{
        Authorization: 'Bearer '+token
      }
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch sales.');
    }
    const allSales = data.sales;
    const transformedItems = 
      {sales:[],
        debt:[],
        order:[],
        salesPageCount:data.sale_page_count,
        debtsPageCount:data.debt_page_count,
        ordersPageCount:data.order_page_count
      };
    //add key from firebase to id property for each object
    allSales.forEach(sale=>{
      if(sale.debt&&!sale.order_ind){
        transformedItems.debt.push(sale);
      }
      else if(!sale.debt&&!sale.order_ind){
        transformedItems.sales.push(sale);
      }
      else{
        transformedItems.order.push(sale);
      }
    });

    


    //console.log(itemObj);
    return transformedItems;
  }

  export async function deleteSales(requestData,token) {

    const response = await fetch(`${SARI_DOMAIN}/sales/`, {
      method: 'DELETE',
      body:JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+token
      },
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not DELETE SALE.');
    }
  
    return data;
  }

  export async function paidDebt(requestData,token) {

    const response = await fetch(`${SARI_DOMAIN}/sales/`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+token
      },
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Could not UPDATE Sales.');
    }
  
    return data;
  }
  //authenticate user upon logging in
  export async function authUser(requestData) {
  
    try{
      const response = await fetch(`${SARI_DOMAIN}/users/`, {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.message || 'Could not Auth User.');
      }
    
      return { data };
    }
    catch(err){
      const errorLog = err.toString();
      if(errorLog.includes('TypeError: Failed to fetch')){
        return {message:"Could not connect to server. Please contact host server provider!"};
      }else{
        return {message:"Unknown error. Please ask support to investigate"};
      }
    }
   
  }

  //get all data for Home Component
export async function getHomeData(token) {
  const dateToday = new Date().toLocaleDateString();
  const response = await fetch(`${SARI_DOMAIN}/sales/data?today_date=${dateToday}`,{//token auth
    headers:{
      Authorization: 'Bearer '+token
    }
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch home data.');
  }
  //console.log(data);
  const transformedItems = data;
  return transformedItems;
}


