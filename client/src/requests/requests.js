import axios from "axios";

export async function createEntry(entryString) {
  try {
    // name, phoneNum, cashApp, numOfSpots
    let contents = entryString.split(/[ ,]+/).filter(Boolean);
    console.log(contents);
    // Name
    const name =
      contents.length >= 4 ? `${contents[0]} ${contents[1]}` : contents[0];
    console.log(name);
    // PhoneNum
    const phoneNum = contents.length >= 4 ? contents[2] : contents[1];
    // Cash App
    const cashApp = contents.length >= 4 ? contents[3] : contents[2];
    // Num of Spots
    const numOfSpots =
      contents.length >= 4 ? Number(contents[4]) : Number(contents[3]);

    // Send Request to the Server
    await axios.post("http://localhost:5000/", {
      name,
      phoneNum,
      cashApp,
      numOfSpots,
    });
    return { success: true };
  } catch (ex) {
    console.error(new Error("Request has failed with an error " + ex));
    return { success: false };
  }
}
