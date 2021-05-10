import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FlickrPublicFeed from "./pages/Flickr/PublicFeed";

const App = () => {
  return (
    <Router onChange={() => { }}>
      <Navbar />
      <Route exact path="/" component={FlickrPublicFeed} />
      <Footer />
    </Router>
  );
};

export default App;
