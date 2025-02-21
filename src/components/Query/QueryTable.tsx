import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { RecentQuery } from "./RecentQuery";


interface QueryType{
  _id:string
  email: string,
  name: string,
  phoneNo: number,
  query: string,
  createdAt?:string,
  comment?:string,
}
export default function QueryTable({
  queries,
  fetchData,
}: {
  queries: QueryType[];
  fetchData: () => void;
}) {
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);
  const [recentQuery, setRecentQuery] = useState<boolean>(false);
  // const [allQuery, setAllQuery] = useState<boolean>(false);
  const [viewQuery, setViewQuery] = useState<QueryType>();

  const closeRecentQueryModal = () => setRecentQuery(false);
  // const closeAllQueryModal = () => setAllQuery(false);


  const handleCheckboxChange = (queryId: string) => {
    setSelectedQueries((prev) =>
      prev.includes(queryId)
        ? prev.filter((id) => id !== queryId)
        : [...prev, queryId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
        setSelectedQueries(queries.map((query) => query._id));
    } else {
        setSelectedQueries([]);
    }
  };

  const handleExport = () => {
    console.log("Exporting queries:", selectedQueries);
    // Implement export logic here.
  };


  const handleView = (query:any) => {
    setRecentQuery(!recentQuery);
    setViewQuery(query)
  };
  // const handleViewDetails = () => {
  //   setAllQuery(!allQuery);
  // };

  return (
    <div className="space-y-4">
      <Table >
        <TableCaption>A list of your queries.</TableCaption>
        <TableHeader className=" bg-[#f4f0f0] p-5">
          <TableRow >
            <TableHead className="w-[50px] text-black p-2">
              <Checkbox
                checked={setSelectedQueries.length === queries.length}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                aria-label="Select all queries"
              />
            </TableHead>
            <TableHead className="text-black">Sr. No</TableHead>
            <TableHead className="text-black">Name</TableHead>
            <TableHead className="text-black">Contact</TableHead>
            <TableHead className="text-black">Email ID</TableHead>
            <TableHead className="text-black">Query Date</TableHead>
            <TableHead className="text-black">Recent Query</TableHead>
            {/* <TableHead className="text-black">View</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {queries.map((query, index) => (
            <TableRow key={query._id}>
              <TableCell>
                <Checkbox
                  checked={selectedQueries.includes(query._id)}
                  onCheckedChange={() => handleCheckboxChange(query._id)}
                  aria-label={`Select queries ${query._id}`}
                />
              </TableCell>
              <TableCell>{index + 1}</TableCell> 
              <TableCell >{query.name}</TableCell>
              <TableCell >{query.phoneNo}</TableCell>
              <TableCell >{query.email}</TableCell>
              <TableCell>{query.createdAt}</TableCell>
              <TableCell>
                  <Button
                    onClick={() => handleView(query)}
                  >
                    View
                  </Button>
              </TableCell>
              {/* <TableCell>
                  <Button
                  onClick={()=>handleViewDetails()} >
                    View Details
                  </Button>
              </TableCell> */}
              
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="bg-white" colSpan={5}>
              {selectedQueries.length > 0 && (
                <div className="flex justify-between">
                  <span>
                    Selected Queries: {selectedQueries.length} of {queries.length}
                  </span>
                  <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Selected
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <RecentQuery query={viewQuery} fetchData={fetchData} isOpen={recentQuery} onClose={closeRecentQueryModal}/>
      {/* <AllQuery isOpen={allQuery} onClose={closeAllQueryModal}/> */}
    </div>
  );
}
