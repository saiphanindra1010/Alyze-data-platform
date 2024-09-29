
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, EllipsisVertical, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const Connectionslist = () => {
  return (

    <div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Connections Name</TableHead>
            <TableHead>Application</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        <TableRow>
            <TableCell>Conte.pvt Database</TableCell>
            <TableCell>MongoDB</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {" "}
                  <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="text-rose-600">
                    {" "}
                    <Trash2 /> Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>  <TableRow>
            <TableCell>Conte.pvt Database</TableCell>
            <TableCell>MongoDB</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {" "}
                  <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="text-rose-600">
                    {" "}
                    <Trash2 /> Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          
        </TableBody>
      </Table>
    </div>
  
  );
};

export default Connectionslist;
