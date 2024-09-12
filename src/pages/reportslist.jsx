import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
const reportslist = () => {
  return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        Document Name
                    </TableHead>
                    <TableHead>
                        Application
                    </TableHead>
                </TableRow>

            </TableHeader>
            <TableBody>
            <TableRow>
                    <TableCell>
                        Document Name
                    </TableCell>
                    <TableCell>
                        Application
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
  )
}

export default reportslist