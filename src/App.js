import "./index.css";
import Header from "./components/header";
import Catalog from "./components/catalog";
import Products from "./components/products";
import AllProducts from "./components/allProducts";
import Register from "./components/register";
import Categoried from "./components/categoried";
import Page404 from "./components/page404";
import Sitemap from "./components/sitemap";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Detail from './components/detail';
function App() {
  function Home() {
    return (
      <>
        <Header />
        <Catalog/>
        <Products />
      </>
    );
  }
  return (
    <>
      <Router >
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/products/:productId" element={<Detail/>} />
            <Route path="/buying/:productId" element={<Register/>}/>
            <Route path="/products/" element={<AllProducts/>}/>
            <Route path="/categoried/" element={<Categoried/>}/>
            <Route path="*" element={<Page404/>}/>
            <Route path="/bruh4sitemap" element={<Sitemap/>}/>
      </Routes>
      </Router>
    </>
  );
}

export default App;
