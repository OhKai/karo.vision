import Tags from "@/components/tags";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Camera,
  EllipsisVertical,
  FolderOpen,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import MediaThemeYt from "player.style/yt/react";

export async function generateStaticParams() {
  return [{ videoId: "page" }];
}

const VideoPage = () => {
  return (
    <div className="h-screen flex">
      <MediaThemeYt className="w-full h-full">
        <video
          slot="media"
          className="w-full h-full bg-foreground"
          src=""
          playsInline
          autoPlay
        ></video>
      </MediaThemeYt>
      <div className="w-[350px] bg-white flex flex-col px-3.5 py-3.5">
        <h4 className="text-title text-[15px] font-medium mb-[3px]">Youtube</h4>
        <h3 className="text-xl font-medium tracking-[0.25px] mb-5">
          Credit Card
        </h3>
        <div className="flex flex-col grow overflow-auto px-3.5 -mx-3.5">
          <Tags
            values={[
              "favoritesdssdldsf sdfkdsksdfsd abcddssdldsf sdfkdsksdfsd abcd dssdldsf sdfkdsksdfsd abcd",
              "ahhhhaa",
              "dssdldsf sdfkdsksdfsd",
              "sdfdsfdsfdsfdfs",
              "favorites2",
              "ahhhhaa2",
              "dssdldsf sdfkdsksdfsd2",
              "sdfdsfdsfdsfdfs2",
            ]}
            maxLines={2}
            expandable
            className="mb-7"
          />
          <div className="grid grid-cols-2 text-xs font-light justify-between text-accent-foreground gap-2.5 mb-8">
            <span>05.06.2024</span>
            <span>1 GB</span>
            <span>1024x720</span>
            <span>60 FPS</span>
            <span className="text-ellipsis overflow-hidden col-span-2">
              /downloads/new/downloads/new/downloads/new/downloads/new
            </span>
          </div>
          <div className="text-sm text-secondary-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            blandit, justo nec lacin ia fermentum, nunc nisl ultricies nunc, nec
            a ugue lacus augue sit amet erat. Nulla facilisi. Ut sit amet libero
            vitae magna fringilla aliquam. Nam euismod, turpis ac malesuada
            tincidunt, odio mi ultricies lacus, a varius mi odio nec ligula.
            Phasellus ac ligula nec nunc ultricies ultricies. Nullam blandit,
            justo nec lacinia fermentum, nunc nisl ultricies nunc, nec augue
            lacus augue sit amet erat. Nulla facilisi. Ut sit amet libero vitae
            magna fringilla aliquam. Nam euismod, turpis ac malesuada tincidunt,
            odio mi ultricies lacus, a varius mi odio nec ligula. Phasellus ac
            ligula nec nunc ultricies ultricies. Nullam blandit, justo nec
            lacinia fermentum, nunc nisl ultricies nunc, nec augue lacus augue
            sit amet erat. Nulla facilisi. Ut sit amet libero vitae magna
            fringilla aliquam. Nam euismod, tur pis ac malesuada tincidunt, odio
            mi ultricies lacus, a varius mi odio nec ligula. Phasellus ac ligula
            nec nunc ultricies ultricies. Nullam blandit, justo nec lacinia
            fermentum, nunc nisl ultricies nunc, nec augue lacus augue sit amet
            erat. Nulla facilisi. Ut sit amet libero vitae magna fringilla
            aliquam. Nam euismod, turpis ac malesuada tincidunt, odio mi
            ultricies lacus, a varius mi odio nec ligula. Phasellus ac ligula
            nec nunc ultricies ultricies. Nullam blandit, justo nec lacinia
            fermentum, nunc nisl ultricies nunc, nec augue lacus augue sit amet
            erat. Nulla facilisi. Ut sit amet libero vitae magna fringilla
            aliquam. Nam euismod, tur pis ac malesuada tincidunt, odio mi
            ultricies lacus, a varius mi odio nec ligula. Phasellus ac ligula
            nec nunc ultricies ultricies. Nullam blandit, justo nec lacinia
            ferment um, nunc nisl ultricies nunc, nec augue lacus augue sit amet
            erat. Nulla facilisi. Ut sit amet libero vitae magna fringilla
            aliquam. Nam eu ismod, turpis ac malesuada tincidunt, odio mi
            ultricies lacus, a varius mi odio nec ligula. Phasellus ac ligula
            nec nunc ultricies ultricies. Nullam blandit, justo nec lacinia
            fermentum, nunc nisl ultricies nunc, nec augue lacus augue sit amet
            erat. Nulla facilisi. Ut sit amet libero vitae magna fringilla
            aliquam. Nam euismod, tur pis ac malesuada tincidunt, odio mi
            ultricies lacus, a varius mi odio nec ligula. Phasellus ac ligula
            nec nunc ultricies ultricies. Nullam blandit, justo nec lacinia
            ferment um, nunc nisl ultricies nunc, nec augue lacus augue sit amet
            erat. Nulla facilisi. Ut sit amet libero vitae magna fringilla
            aliquam. Nam eu ismod, turpis ac malesuada tincidunt, odio mi
            ultricies lacus, a varius mi odio nec ligula. Phasellus ac ligula
            nec nunc ultricies ultricies. Nullam blandit, justo nec lacinia
            fermentum, nunc nisl ultricies nunc, nec augue lacus augue sit amet
            erat. Nulla facilisi.
          </div>
        </div>
        <div className="flex gap-2.5 flex-col mt-3.5">
          <div className="flex gap-2.5">
            <Button variant="outline" className="flex-1">
              <Pencil /> Edit
            </Button>{" "}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <Camera />
                  <span>Set as thumbnail</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FolderOpen />
                  <span>Reveal in Finder</span>
                  <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw />
                  <span>Sync Player</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>{" "}
          </div>
          <Button variant="destructive">
            <Trash2 /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
