import Viewer from "./viewer";

export async function generateStaticParams() {
  return [{ videoId: "page" }];
}

const VideoPage = () => {
  return <Viewer />;
};

export default VideoPage;
