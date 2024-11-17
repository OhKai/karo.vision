import Player from "./player";

export async function generateStaticParams() {
  return [{ videoId: "page" }];
}

const VideoPage = () => {
  return <Player />;
};

export default VideoPage;
