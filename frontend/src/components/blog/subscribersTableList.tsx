import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  interface SubscribersTableListProps {
    subscribers: string[];  
  }
  
  export const SubscribersTableList = ({ subscribers }: SubscribersTableListProps) => {
    return (
      <Table>
        <TableCaption>A list of your subscribers' emails.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.length > 0 ? (
            subscribers.map((subscriber, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{subscriber}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center">No subscribers found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };
  