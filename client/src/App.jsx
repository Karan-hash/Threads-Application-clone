import { Container } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Headers from "./components/Headers";
function App() {
  return (
    <Container maxW="620px">
      <Headers />
      <Routes>
        <Route path="/:username" element={<UserPage />}/>
        <Route path="/:username/post/:pid" element={<PostPage />}/>
      </Routes>
    </Container>
  );
}

export default App;
