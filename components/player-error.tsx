import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const PlayerError = () => {
  return (
    <Card className="m-5 w-[650px] max-lg:w-full">
      <CardHeader>
        <CardTitle>Playback error</CardTitle>
        <CardDescription>
          This video cannot be played in the browser. The reason might be a
          corrupt file or an unsupported format. You can choose how to proceed
          with the file.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-end gap-3 max-md:flex-col">
        <Button variant="outline" className="max-xl:hidden">
          Reveal in Finder
        </Button>
        <Button variant="outline" className="max-md:w-full">
          Open in VLC
        </Button>
        <Button className="max-md:w-full">Convert to MP4 (H.264)</Button>
      </CardFooter>
    </Card>
  );
};

export default PlayerError;
