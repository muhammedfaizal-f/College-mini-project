import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from'./componts/Home.jsx'
import Service from'./componts/Service.jsx'
import About from'./componts/About.jsx'
import Navbar from './componts/Navbar.jsx'
import Howitworks from './componts/Howitworks.jsx'
import WhyChooseUs from './componts/WhyChooseUs.jsx'
import TopProviders from './componts/TopProviders.jsx'
import Testimonials from './componts/Testimonials.jsx'
import Footer from './componts/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Navbar />
    <Home />
    <Service />
    <Howitworks />
    <WhyChooseUs />
    <TopProviders />
    <Testimonials />
    <Footer />
    <About />  
    
    
  </StrictMode>,
)
