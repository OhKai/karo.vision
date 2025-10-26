import Viewer from "./viewer";

export async function generateStaticParams() {
  return [{ photoId: "page" }];
}

const PhotoPage = () => {
  return <Viewer />;
};

export default PhotoPage;
