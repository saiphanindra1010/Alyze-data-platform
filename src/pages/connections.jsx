import Createconnection from "@/components/createconnection/createconnection"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Layout from "@/components/layout/layout"
import Connectionslist from "@/pages/Connectionslist"
const connections = () => {
  return (
    <Layout>
    <div >
      <div className="flex justify-end">  
      <Createconnection/>
      </div>

<Connectionslist/>
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>

    </div>
    </Layout>
    

  )
}

export default connections