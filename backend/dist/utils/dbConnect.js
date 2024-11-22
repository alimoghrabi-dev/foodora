import { connect } from "mongoose";
async function ConnectToDatabase() {
    try {
        const connetion = await connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${connetion.connection.host}`);
    }
    catch (error) {
        console.log(error);
        throw new Error("Cannot Connect To MongoDB");
    }
}
export default ConnectToDatabase;
//# sourceMappingURL=dbConnect.js.map