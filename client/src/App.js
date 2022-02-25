import "./App.css";

// components
import Index from "./components/Index/Index";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Protectedroute from "./components/Protectedroute/Protectedroute";

function App() {
  return (
    <>
      <h1>THIS IS THE FRONT-END PAGE!!</h1>
      <Index />
      <Login />
      <Dashboard />
      <Protectedroute />
    </>
  );
}

export default App;
