export default function Header(props) {
    const production = 'https://musicnotes.herokuapp.com';
    const development = 'http://localhost:3000';

    function HeaderLink(props) {
        if (process.env.REACT_APP_ENV === 'production') {
            return (
                <h1>
                    <a href={production} className="link-light header-link">
                        Music Notes
                    </a>
                </h1>
            );
        }
        // otherwise, we're in dev
        return (
            <h1>
                <a href={development} className="link-light header-link">
                    Music Notes
                </a>
            </h1>
        );
    }

    return (
        <div>
            <HeaderLink />
            <h6>Keep track of music memories.</h6>
        </div>
    );
}
        // <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        //     <div className="container-fluid">
        //         <div className="navbar-brand me-auto">
        //             Music Notes
        //         </div>
        //         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        //             <span className="navbar-toggler-icon"></span>
        //         </button>
        //         <div className="collapse navbar-collapse" id="navbarSupportedContent">
        //             <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        //                 <li className="nav-item dropdown ms-auto">
        //                     <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        //                         <img
        //                             width="30px"
        //                             className="profile-pic"
        //                             alt="profile pic"
        //                             src="https://pbs.twimg.com/media/C8SFjSbXgAAKoZx?format=jpg&name=small"
        //                         />
        //                         <span className="ms-2">
        //                             samah
        //                         </span>
        //                     </a>
        //                     <ul className="dropdown-menu">
        //                         <li><a className="dropdown-item" href="#">Log out</a></li>
        //                     </ul>
        //                 </li>
        //             </ul>
        //         </div>
        //     </div>
        // </nav>