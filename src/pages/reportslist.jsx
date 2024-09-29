import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/layout";
const reportslist = () => {
  return (
    <Layout>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Info corp.pvt.ltd Mongo db</CardTitle>
              <CardDescription className="max">
                Findind what is the best usecase foe the validation helping
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">
                <Download />
              </Button>
            </CardFooter>
          </Card>
        </div>    
      </div>
    </Layout>
  );
};

export default reportslist;
