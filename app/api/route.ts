import { TablesDB, Query } from "appwrite";
import UseAppwrite, { ID } from "../appwrite-client";

// get cards
export async function GET() {
  const { client, account } = await UseAppwrite();
  const user = await account.get();

  const tablesDB = new TablesDB(client);
  const response = await tablesDB.listRows({
    databaseId: "68ce67980016a7265668",
    tableId: "cards",
    queries: [
      Query.equal("userId", user.$id),
    ]
  });
  return Response.json(response);
}

// create card
export async function POST(request: Request) {
  const data = await request.json();
  const { client, account } = await UseAppwrite();
  const user = await account.get();
  
  const tablesDB = new TablesDB(client);
  console.log(data, data?.content?.length)
  const response = await tablesDB.createRow({
    databaseId: "68ce67980016a7265668",
    tableId: "cards",
    rowId: ID.unique(),
    data: {
      ...data,
      userId: user.$id,
    }
  });
  return Response.json(response);
}