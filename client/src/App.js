// import { Route, Routes } from "react-router-dom";

import Footer from './components/Footer';
import Header from './components/Header'
import NotesList from './components/NotesList';

function App(props) {
  return (
    <div className="body d-flex flex-column sticky-footer-wrapper min-vh-100">
      <Header />
      <NotesList />
      <Footer />
      {/* <Routes>
        <Route exact path="/" element={<NotesList userPlaylists={props.userPlaylists} />} />
      </Routes> */}
    </div>
  );
}

export default App;