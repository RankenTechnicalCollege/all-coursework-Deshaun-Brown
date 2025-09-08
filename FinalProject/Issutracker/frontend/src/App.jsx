
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">My Issue Tracker</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#users">Users</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#bugs">Bugs</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className="container flex-grow-1 py-4">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header bg-light fw-bold">Users</div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">DeSean Brown</li>
                <li className="list-group-item">Paul Smith</li>
                <li className="list-group-item">Mickey Mouse</li>
                <li className="list-group-item">Donald Duck</li>
              </ul>
              <div className="card-footer small text-muted">Use your own user names.</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header bg-light fw-bold">Bugs</div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><a href="#">It's broken, please fix.</a></li>
                <li className="list-group-item"><a href="#">Crash on startup.</a></li>
                <li className="list-group-item"><a href="#">I'm not even sure what happened<br/>here is the error code 404 ...</a></li>
                <li className="list-group-item"><a href="#">Doesn't support wide screen monitors.</a></li>
                <li className="list-group-item"><a href="#">Text is too small on my 4K monitor.</a></li>
                <li className="list-group-item"><a href="#">Doesn't work on my iPhone 3.</a></li>
              </ul>
              <div className="card-footer small text-muted">Use your own bug names.</div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-dark text-light text-center py-3 mt-auto">
        &copy;2025 DeSean Brown
      </footer>
    </div>
  );
}

export default App;
