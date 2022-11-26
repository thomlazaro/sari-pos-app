import Pagination from 'react-bootstrap/Pagination';
import { useDispatch } from 'react-redux';
import { itemsActions } from '../../store/items-slice';
import { salesActions } from '../../store/sales-slice';
import { debtActions } from '../../store/debt-slice';

//format page array function
export const formatPageArray = (currentPage,pageCount) =>{
    const pageArray = [];
    let maxPage = currentPage+3;
    let offsetPage = currentPage-3;
    
    if(offsetPage<=0){
        offsetPage = 1;
    }

    if(maxPage>pageCount){
        maxPage = pageCount
    }
    for(let x=offsetPage;x<=maxPage;x++){
        pageArray.push(x);
    }

    return pageArray;
}

const PageUI = (props) =>{
    const dispatch = useDispatch();
    const pageArray = formatPageArray(props.currentPage,props.pageCount);
    const pageElement = [];
    for(const page of pageArray){
        if(page!==props.currentPage){
            pageElement.push(<Pagination.Item key={page} onClick={()=>pageHandler(page)}>{page}</Pagination.Item>);
        }
        else{
            pageElement.push(<Pagination.Item active key={page} onClick={()=>pageHandler(page)}>{page}</Pagination.Item>);
        }
    }

    const pageHandler = (page)=>{
        //console.log(page);

        if(props.actionFor==="Items"){
            
                dispatch(itemsActions.replacePageItems(
                  {
                    currentPage:parseInt(page)
                  }
                ));
                return;
        }

        if(props.actionFor==="Sales"){
            
            dispatch(salesActions.replacePageSales(
              {
                currentPage:parseInt(page)
              }
            ));
            return;
        }

        if(props.actionFor==="Debts"){
            
            dispatch(debtActions.replacePageDebts(
              {
                currentPage:parseInt(page)
              }
            ));
            return;
        }
        
    }

    return(

            <Pagination>
                <Pagination.First 
                    disabled={props.currentPage===1?true:false}
                    onClick={()=>pageHandler(1)}
                />
                <Pagination.Prev 
                    disabled={props.currentPage===1?true:false}
                    onClick={()=>pageHandler(props.currentPage-1)}
                />
                {pageElement}
                <Pagination.Next 
                    disabled={props.pageCount===props.currentPage?true:false}
                    onClick={()=>pageHandler(props.currentPage+1)}
                />
                <Pagination.Last 
                    disabled={props.pageCount===props.currentPage?true:false}
                    onClick={()=>pageHandler(props.pageCount)}
                />
            </Pagination>
    )
}

export default PageUI;