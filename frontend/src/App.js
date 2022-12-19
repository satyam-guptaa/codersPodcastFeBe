/* eslint-disable react/prop-types */
import "./App.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Home from "./pages/Home/Home"
import Navigation from "./components/shared/Navigation/Navigation"
import Authenticate from "./pages/Authenticate/Authenticate"
import Activate from "./pages/Activate/Activate"
import Rooms from "./pages/Rooms/Rooms"
import { useSelector } from "react-redux"



function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route
          path="/"
          exact
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        ></Route>
        <Route
          path="/authenticate"
          element={
            <GuestRoute>
              <Authenticate />
            </GuestRoute>
          }
        ></Route>
        <Route
          path="/activate"
          element={
            <SemiProtected>
              <Activate />
            </SemiProtected>
          }
        ></Route>
        <Route
          path="/rooms"
          element={
            <Protected>
              <Rooms />
            </Protected>
          }
        ></Route>
      </Routes>
    </Router>
  )
}

const GuestRoute = ({ children }) => {
  const { isAuth } = useSelector(state => state.auth);
  if (isAuth) return <Navigate to="/rooms" replace />
  return children
}

const SemiProtected = ({ children }) => {
  const { isAuth, user } = useSelector(state => state.auth);
  return !isAuth ? (
    <Navigate to="/" replace />
  ) : isAuth && !user.activated ? (
    children
  ) : (
    <Navigate to="/rooms" replace />
  )
}

const Protected = ({ children }) => {
  const { isAuth, user } = useSelector(state => state.auth);
  return !isAuth ? (
    <Navigate to="/" replace />
  ) : isAuth && !user.activated ? (
    <Navigate to="/activate" replace />
  ) : (
    children
  )
}

export default App
