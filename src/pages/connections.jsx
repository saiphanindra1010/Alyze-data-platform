import Createconnection from "@/components/createconnection/createconnection"


import Layout from "@/components/layout/layout"
import Connectionslist from "@/pages/Connectionslist"
const connections = () => {
  return (

    <div>
    <div className=" w-full max-w-7xl mx-auto h-full flex flex-col">
      <Createconnection/>
      </div>

<Connectionslist/>


    </div>
  
    

  )
}

export default connections