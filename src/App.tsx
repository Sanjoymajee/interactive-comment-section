import "./App.css";
import CommentSection from "./components/CommentSection";
import { CommentProvider } from "./Hooks/UseCommentReply";
function App() {
  return (
    <>
      <CommentProvider>
        <CommentSection />
      </CommentProvider>
    </>
  );
}

export default App;
