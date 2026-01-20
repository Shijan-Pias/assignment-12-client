import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../Pages/Home/Home";
import Faq from "../Pages/FooterInfo/Faq";
import Term from "../Pages/FooterInfo/Term";
import Privacy from "../Pages/FooterInfo/Privacy";
import AuthLayout from "../layout/AuthLayout";
import Register from "../Authentication/Register";
import Login from "../Authentication/Login";
import AddMedicine from "../Addmedicine/AddMedicine";
import DashBoardLayout from "../layout/DashBoardLayout";
import PrivateRoutes from "../Routes/PrivateRoutes";
import MyCart from "../Pages/DashBoard/MyCart/MyCart";
import Shop from "../SystemPages/Shop";
import Payment from "../Pages/DashBoard/Payment/Payment";
import CategoryDetails from "../SystemPages/CategoryDetails";
import InvoicePage from "../SystemPages/InvoicePage";
import PaymentHistory from "../Pages/DashBoard/PaymentHistory";
import MakeAdmin from "../Pages/DashBoard/MakeAdmin/MakeAdmin";
import Forbiden from "../Pages/Forbiden/Forbiden";
import AdminRoute from "../Routes/AdminRoutes";
import ManageMedicines from "../Pages/DashBoard/SellerDashBoard/ManageMedicines";
import SellerPaymentHistory from "../Pages/DashBoard/SellerDashBoard/SellerPaymentHistory";
import ManageMedicinesAdmin from "../Pages/DashBoard/SellerDashBoard/ManageMedicines";
import ManageCategoriesAdmin from "../Pages/DashBoard/MakeAdmin/ManageCategory";
import AdminPayments from "../Pages/DashBoard/MakeAdmin/AdminPayment";
import ReportAdmin from "../Pages/DashBoard/MakeAdmin/ReportPage";
import CategoryCardSection from "../Pages/Home/CategoryCardSection";
import DiscountProducts from "../Pages/Home/DiscountProduct";
import SellerRoutes from "../Routes/SellerRoutes";
import UpdateProfile from "../Authentication/UpdateProfile";
import ManagePrescriptions from "../Pages/DashBoard/MakeAdmin/ManagePrescription";
import MyPrescriptions from "../Pages/DashBoard/UserDashboard/MyPrescription";

export const router = createBrowserRouter([
  {
    path: "/",
   Component: RootLayout,
   children:[
    {
      index: true,
      Component:Home
    },
    {
      path:'faq',
      Component:Faq
    },
    {
      path:'terms',
      Component:Term
    },
    {
      path:'privacy',
      Component:Privacy
    },
    {
      path: 'shopPage',
      Component: Shop
    },
    {
      path:'updateProfile',
      element:<PrivateRoutes><UpdateProfile></UpdateProfile></PrivateRoutes>
    },
    {
      path:'myCart',
      element: <PrivateRoutes><MyCart></MyCart></PrivateRoutes>
    },
    {
      path : 'invoice/:id',
      element:<PrivateRoutes><InvoicePage></InvoicePage></PrivateRoutes>

    },
    {
      path: 'category/:category',
      Component: CategoryDetails
    },
    {
      path:'forbiden',
      Component:Forbiden
    },
    {
      path: 'categoryCard',
      Component: CategoryCardSection
    },
    {
      path: 'discountProduct',
      Component:DiscountProducts
    }
   ]
  },

  //authentication 
  {
    path : '/',
    Component: AuthLayout,
    children : [
      {
        path:'register',
        Component:Register
      },
      {
        path:'login',
        element:<Login></Login>
      }
    ]
  },
  {
    path:'/dashBoard',
    element: <PrivateRoutes><DashBoardLayout></DashBoardLayout></PrivateRoutes> ,
    children:[
      
      {
        path:'payment/:cartId',
        Component: Payment
      },
      {
        path: 'paymentHistory',
        Component:PaymentHistory
      },
      {
        path:'myPrescription',
        Component:MyPrescriptions
      },
      {
      path : 'addMedicine',
        element:<SellerRoutes><AddMedicine></AddMedicine></SellerRoutes>
      },
      {
        path:'manageMedicine',
        element:<SellerRoutes><ManageMedicines></ManageMedicines></SellerRoutes>
      },
      {
        path:'sellerPaymentHistory',
        element:<SellerRoutes><SellerPaymentHistory></SellerPaymentHistory></SellerRoutes>
      },
      {
        path:'makeAdmin',
        element:<AdminRoute><MakeAdmin></MakeAdmin></AdminRoute>
       
      },
      {
        path:'manageCategory',
        element:<AdminRoute><ManageCategoriesAdmin></ManageCategoriesAdmin></AdminRoute>
      },
      {
        path:'adminPayment',
        element:<AdminRoute><AdminPayments></AdminPayments></AdminRoute>
      },
      {
        path:'report',
        element:<AdminRoute><ReportAdmin></ReportAdmin></AdminRoute>
      },
      {
        path: 'managePrescription',
        element: <AdminRoute><ManagePrescriptions></ManagePrescriptions></AdminRoute>
      }
    ]
  }
]);