import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedComponent from './components/AnimatedComponent';
import Toast from './components/Toast';

function App() {
    return (
        <>
            <Toast />
            <Router>
                <AnimatedComponent />
            </Router>
        </>
    );
}

export default App;
