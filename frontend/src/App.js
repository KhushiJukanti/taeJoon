import './App.css';
import CameraCapture from './components/CameraCapture';
import { Container, Navbar } from 'react-bootstrap';
import backgroundImage from './Back.jpg';



function App() {
  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Camera OCR Dictionary</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <CameraCapture />
      </Container>
    </div >

  );
}

export default App;