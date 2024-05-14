import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";


const UserPage = () => {
  return (
    <>
    User Page
    <UserHeader />
    <UserPost likes={1200} replies={481} postImg="/post1.png" postTitle="Let's talk about threads"/>
    <UserPost likes={100} replies={81} postImg="/post2.png" postTitle="Nice tution"/>
    <UserPost likes={200} replies={48} postImg="/post3.png" postTitle="Keep talking about threads"/>
    <UserPost likes={120} replies={41} postTitle="My first thread"/>
    </>
  )
}
export default UserPage;
