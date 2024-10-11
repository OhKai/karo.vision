import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeaderNav from "./header-nav";
import SearchBar from "./search-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Home = () => {
  return (
    <div className="grid grid-rows-[70px_1fr] justify-items-center min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <header className="grid grid-cols-3 items-center justify-items-center w-full px-6 text-muted-foreground border-b border-secondary">
        <div className="flex items-center gap-2 justify-self-start select-none">
          <Image
            src="/logo.png"
            alt="Karo.Vision Home Cloud"
            width={48}
            height={31}
            className="invert-[.145]"
          />
          <h2 className="text-base font-bold flex flex-col leading-none tracking-[0.25px]">
            <span className="text-xs">karo.vision</span>
            <span>Home&nbsp;Cloud</span>
          </h2>
        </div>
        <HeaderNav />
        <Button
          className="justify-self-end"
          size="icon"
          variant="ghost"
          title="Settings"
        >
          <Settings />
        </Button>
      </header>
      <main className="flex flex-col gap-8 items-center py-4 w-full">
        <SearchBar />
        <Table className="font-light text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[92px]"></TableHead>
              <TableHead className="w-[100px]">Length</TableHead>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead className="w-[130px]">Topic</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-[250px] xl:table-cell hidden">
                Path
              </TableHead>
              <TableHead className="w-[105px] lg:table-cell hidden">
                Created
              </TableHead>
              <TableHead className="text-right w-[100px] lg:table-cell hidden">
                Size
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="p-1 pl-4">
                <Image
                  src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                  alt=""
                  width={72}
                  height={40.5}
                />
              </TableCell>
              <TableCell className="overflow-ellipsis overflow-hidden max-w-[100px]">
                99999:34:45
              </TableCell>
              <TableCell className="font-medium overflow-ellipsis overflow-hidden max-w-[300px]">
                Credit Card
              </TableCell>
              <TableCell className="overflow-ellipsis overflow-hidden max-w-[130px]">
                Youtube
              </TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-[11px] px-4 py-1 h-auto"
                >
                  favorites
                </Button>
              </TableCell>
              <TableCell className="xl:table-cell hidden overflow-ellipsis overflow-hidden max-w-[250px]">
                /downloads/new
              </TableCell>
              <TableCell className="lg:table-cell hidden">05.06.2024</TableCell>
              <TableCell className="text-right lg:table-cell hidden overflow-ellipsis overflow-hidden max-w-[100px]">
                1 GB
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </main>
    </div>
  );
};

export default Home;
