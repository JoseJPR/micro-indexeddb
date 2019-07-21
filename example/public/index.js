/**
 * @name: Db
 * @description: This class is necessary to be able to use an IndexedDB database, 
 *               you can insert, update, delete and list records in different 
 *               tables of different databases.
 */
class Db {

  /**
   * @name init
   * @description Define structure and open db with custom name and version.
   * @param {string} dbName | Database name.
   * @param {number} dbVersion | Database version.
   * @param {!Array<object>} dbCollections | Array object collections.
   * @returns {Promise} | Promise object.
   * @example Db.initDb("myDB", 1, [{ name: "Article", details: { keyPath: "id" }]);
   */
  async init(dbName, dbVersion, dbCollections) {

    return new Promise((resolve, reject) => {

      // Get if indexedDB is in window object.
      if (!window.indexedDB) {
        console.error("Your browser doesn't support a stable version of IndexedDB.");
        reject("Your browser doesn't support a stable version of IndexedDB.");
      } else { 
        console.log("[ Db | status | indexedDB ]", indexedDB);
      }

      // Open custom DB with name and version.
      this.openRequest = indexedDB.open(dbName, dbVersion);
      this.openRequest.onerror = () => {
        reject(this.openRequest.error);
      };
      this.openRequest.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      this.openRequest.onupgradeneeded = (e) => {
        if(e.target.result){
          this.db = e.target.result;
          // Get all collections for create.
          dbCollections.map((collection) => {
            if (!this.db.objectStoreNames.contains(collection.name)) {
              this.db.createObjectStore(collection.name, collection.details);
            }
            return null;
          });
        }
      }    
    });
  }

  /**
   * @name findAll
   * @description Get all data of collection.
   * @param {string} collection | Collection name.
   * @returns {Promise} | Promise object.
   * @example Db.findAll("Article");
   */
  async findAll(collection) {
    return new Promise((resolve, reject) => {
      const req = this.db.transaction(collection, "readonly").objectStore(collection).getAll();
      req.onsuccess = () => {
        resolve(req.result);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
  }

  /**
   * @name findById
   * @description Get data from collection by keyPath.
   * @param {string} collection | Collection name.
   * @param {number} id | keyPath.
   * @returns {Promise} | Promise object.
   * @example Db.findById("Article", 123456789);
   */
  async findById(collection, id) {
    return new Promise((resolve, reject) => {
      const req = this.db.transaction(collection, "readonly").objectStore(collection).get(id);
      req.onsuccess = () => {
        resolve(req.result);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
  }

  /**
   * @name add
   * @description Insert data into collection.
   * @param {string} collection | Collection name.
   * @param {object} data | Json data.
   * @returns {Promise} | Promise object.
   * @example Db.add("Article", {"id": 123456789, "title": "Hi from JS"});
   */
  async add(collection, data) {
    return new Promise((resolve, reject) => {
      const req = this.db.transaction(collection, "readwrite").objectStore(collection).add(data);
      req.onsuccess = () => {
        resolve(req.result);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
  }

  /**
   * @name put
   * @description: Update data registered by keyPath of collection.
   * @param {string} collection | Collection name.
   * @param {object} data | Json data.
   * @returns {Promise} | Promise object.
   * @example Db.put("Article", {"id": 123456789, "title": "New title"});
   */
  async put(collection, data) {
    return new Promise((resolve, reject) => {
      const req = this.db.transaction(collection, "readwrite").objectStore(collection).put(data);
      req.onsuccess = () => {
        resolve(req.result);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
  }

  /**
   * @name delete
   * @description Delete data by keyPath of collection.
   * @param {string} collection | Collection name.
   * @param {number} id | keyPath.
   * @returns {Promise} | Promise object.
   * @example Db.delete("Article", 123456789);
   */
  async delete(collection, id) {
    return new Promise((resolve, reject) => {
      const req = this.db.transaction(collection, "readwrite").objectStore(collection).delete(id);
      req.onsuccess = () => {
        resolve(req.result);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
  }
};

export default new Db();