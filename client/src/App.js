// import { Route, Routes } from "react-router-dom";

import Header from './components/Header'
import NotesList from './components/NotesList';

function App(props) {
  return (
    <div className="body">
      <Header />
      <NotesList userPlaylists={props.userPlaylists} />
      {/* <Routes>
        <Route exact path="/" element={<NotesList userPlaylists={props.userPlaylists} />} />
      </Routes> */}
    </div>
  );
}

export default App;