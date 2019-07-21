import Db from "./index.js";

(async () => {

  await Db.init("myDB", 1, [{
    name: "Article",
    details: {
      keyPath: "id"
    }
  }]);
  
  const id = await Db.add("Article", {
    "id": Date.now(),
    "title": "Hello World V.1"
  });
  
  console.log(`ID: ${id}`);
  
  const result = await Db.findById("Article", id);
  
  console.log(result);
})();