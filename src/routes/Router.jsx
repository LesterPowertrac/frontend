import {Navigate, createHashRouter} from "react-router-dom";
import DefaultLayout from "../views/DefaultLayout";
import Monitoring from "../Pages/Monitoring";
import Dispatching from "../Pages/Dispatching";
import Pending from "../Pages/Pending";
import NotFound from "../Pages/Notfound";
import IteneraryEdit from "../Pages/IteneraryEdit";
import ViewItinerary from "../Pages/ViewItinerary";
import Test from "../Pages/test";
import BudgetandControl from "../Pages/BudgetandControl";
import Employee from "../Pages/Employee";
import Categories from "../Pages/Categories";
import Supplier from "../Pages/Supplier";
import EmployeeEdit from "../Pages/EmployeeEdit";
import ViewEmployee from "../Pages/ViewEmployee";
import SupplierEdit from "../Pages/SupplierEdit";
import ViewSupplier from "../Pages/ViewSupplier";
import ViewCategories from "../Pages/ViewCategories";
import CategoriesEdit from "../Pages/CategoriesEdit";
import Incentives_Technician from '../Pages/Incentive_Technician';
import Incentive_Advisor from '../Pages/Incentive_Advisor';
import SOmonitoring from "../Pages/SOmonitoring";
import RO_monitoring from "../Pages/RO_monitoring";
import Incentives_FleetAccount from "../Pages/Incentives_FleetAccount";
import Incentives_FleetTechnician from "../Pages/Incentives_FleetTechnician";
import QuarterIncentives from "../Pages/QuarterIncentives";

const Router = createHashRouter([
    {
        path: "/",
        element: <DefaultLayout/>,
        children: [
            {
                path: '/',
                element: <Navigate to="/monitoring" />
            },
            {
                path: '/monitoring',
                element: <Monitoring />
            },

            {
                path: '/dispatching',
                element: <Dispatching />
            },

            {
                path: '/dispatching/:id',
                element: <IteneraryEdit />
            },

            {
                path: '/pending',
                element: <Pending />
            },

            {
                path: '/viewitinerary',
                element: <ViewItinerary/>
            },
            {
                path: '/test',
                element: <Test/>
            },
            {
                path: '/budgetandcontrol',
                element: <BudgetandControl/>
            },
            {
                path: '/employee',
                element: <Employee/>
            },
            {
                path: '/categories',
                element: <Categories/>                
            },
            {
                path: '/viewcategories',
                element: <ViewCategories/>                
            },
            {
                path: '/editcategories/:id',
                element: <CategoriesEdit/>                
            },
            {
                path: '/supplier',
                element: <Supplier/>                
            },     
            {
                path: '/editsupplier/:id',
                element: <SupplierEdit/>                
            },  
            {
                path: '/viewsupplier',
                element: <ViewSupplier/>                
            },               
            {
                path: '/editemployee/:id',
                element: <EmployeeEdit />
            },   
            {
                path: '/viewemployee',
                element: <ViewEmployee />                
            }, 
            {
                path: '/incentive_technician',
                element: <Incentives_Technician />                
            },
            {
                path: '/incentive_advisor',
                element: <Incentive_Advisor/>
            },
            {
                path: '/Incentives_FleetAdvisor',
                element: <Incentives_FleetAccount/>
            },    
            {
                path: '/Incentives_FleetTechnician',
                element: <Incentives_FleetTechnician />
            },                    
            {
                path: '/so-monitoring',
                element: <SOmonitoring/>
            },
            {
                path: '/ro-monitoring',
                element: <RO_monitoring/>
            },
            {
                path: '/quarter-incentives',
                element: <QuarterIncentives/>
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />
    }
]);



export default Router;