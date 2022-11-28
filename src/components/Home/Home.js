import HomeCard from './HomeCard'
import './Home.css'
import { useSelector } from 'react-redux';

const Home = ()=> {

    const homeState = useSelector(state=>state.home);

    return(
      <div className='info'>
        <HomeCard 
        title="Today's Profit"
        subtitle="Total amount of profit earned today"
        text={"P"+homeState.today_total_profit}
        />

        <HomeCard 
        title="Today's Sale"
        subtitle="Total amount of items sold today by selling price"
        text={"P"+homeState.today_total_selling_price}
        />

        <HomeCard 
        title="Today's Base Price"
        subtitle="Total amount of items sold today by base price"
        text={"P"+homeState.today_total_price}
        />

        <HomeCard 
        title="Total Profit Earned"
        subtitle="Total amount of profit earned for all sale made"
        text={"P"+homeState.overall_total_profit}
        />

        <HomeCard 
        title="Total Sale Made"
        subtitle="Total amount of all items for all sale made"
        text={"P"+homeState.overall_total_selling_price}
        />
        <HomeCard 
        title="Total Item Cost Used"
        subtitle="Total amount of all items by its base price"
        text={"P"+homeState.overall_total_price}
        />

        <HomeCard 
        title="Total Possible Profit"
        subtitle="Total amount of profit earned once all items is sold"
        text={"P"+homeState.total_profit}
        />

        <HomeCard 
        title="Total Possible Sale"
        subtitle="Total amount of all items once all of it are sold"
        text={"P"+homeState.total_selling_price}
        />
        <HomeCard 
        title="Total Item Cost"
        subtitle="Total amount of all items that are not yet sold by its base price"
        text={"P"+homeState.total_price}
        />
        <HomeCard 
        title="Total Debt Profit"
        subtitle="Total amount of profit once all debt are paid"
        text={"P"+homeState.total_debt_profit}
        />
        <HomeCard 
        title="Total Debt Amount"
        subtitle="Total amount of all debt that are not paid yet"
        text={"P"+homeState.total_debt_selling_price}
        />
        <HomeCard 
        title="Total Debt Base Amount"
        subtitle="Total amount of all debt that are not paid yet base on its original price"
        text={"P"+homeState.total_debt_price}
        />
      </div>
    )
}

export default Home;